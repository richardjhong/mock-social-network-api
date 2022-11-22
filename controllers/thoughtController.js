const { Thought, User } = require('../models')

const formatDate = (date) => {
  return date.toLocaleDateString()
}

const formatReactionDate = (reactions) => {
  return reactions.map(reaction => {
    return {
      ...reaction._doc,
      createdAt: formatDate(reaction._doc.createdAt)
    }
  })
}

const getThoughts = (req, res) => {
  Thought.find()
    .populate('reactions')
    .then((thoughts) => res.json(thoughts.map(thought => {
      return {
        ...thought._doc,
        createdAt: thought._doc.createdAt.toLocaleDateString(),
        reactions: formatReactionDate(thought._doc.reactions),
      }
    })))
    .catch((err) => res.status(500).json(err))
}

const getSingleThought = (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought with that ID'})
      } else {
        const formattedDateThought = {
          ...thought._doc,
          createdAt: formatDate(thought._doc.createdAt),
          reactions: formatReactionDate(thought._doc.reactions),
        }
        res.json(formattedDateThought)
      }
})
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
    res.status(500).json(err);
  })
}

const updateThought = (req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOneAndUpdate(
    { _id: thoughtId },
    { $set: req.body },
    { new: true },
  )
  .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought found with this id!' })
      : res.json(thought)
  )
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
}

const deleteThought = async (req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOneAndRemove({ _id: thoughtId })
    .then((thought) => 
      !thought
        ? res.status(404).json({ message: 'No thought found with this id!' })
        : User.findOneAndUpdate(
          { thoughts: thoughtId },
          { $pull: { thoughts: thoughtId }},
          { new: true }
        )
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'Thought deleted but no user found with this id!' })
        : res.status(200).json({ message: 'Thought successfully deleted!'})
    )
    .catch((err) => res.status(500).json(err))
}

const addReaction = (req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOneAndUpdate(
    { _id: thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
}

const deleteReaction = (req, res) => {
  const thoughtId = req.params.thoughtId, reactionId = req.params.reactionId;
  Thought.findOneAndUpdate(
    { _id: thoughtId },
    { $pull: { reactions: { reactionId } } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
}