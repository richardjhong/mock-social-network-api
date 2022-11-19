const { Types } = require('mongoose')
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

const updateThought = (req, res) => {
  Thought.findOneAndUpdate(
    req.params.thoughtId,
    { $set: req.body },
    { new: true },
    (err, result) => {
      if (result) {
        res.status(200).json(result)
        console.log(`Updated thought: ${result}`)
      } else {
        console.log('Uh oh, updating thought went wrong')
        res.status(500).json({ message: 'updating thought went wrong'})
      }
    }
  )
}

const deleteThought = async (req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findByIdAndDelete(thoughtId)
    .exec(function(err, removed) {
      User.findOneAndUpdate(
        {"thoughts": {$elemMatch: { $eq: req.params.thoughtId}}},
        {$pull: { thoughts: Types.ObjectId(req.params.thoughtId)}},
        { new: true },
        (err, removedFromUser) => {
          if (err) {
            console.error(err)
          } else {
            res.status(200).json(removedFromUser)
          }
        }
      )
    })
}

module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought
}