const Thought = require('../models/Thought')
const User = require('../models/User')

const getThoughts = (req, res) => {
  Thought.find()
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err))
}

const getSingleThought = (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) => 
      !thought
        ? res.status(404).json({ message: 'No thought with that ID'})
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err))
}

const createThought = (req, res) => {
  Thought.create(
    {
      thoughtText: req.body.thoughtText,
      username: req.body.username,
      reactions: []
    }
  ).then((thought) => {
    return User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: thought._id}},
      { new: true }
    )
  })
  .then((user) =>
    !user
      ? res
        .status(404)
        .json({ message: 'thought created, but no user with this ID'})
      : res.json({ message: 'thought created'})
  )
  .catch((err) => {
    console.error(err)
  })
}

module.exports = {
  getThoughts,
  getSingleThought,
  createThought
}