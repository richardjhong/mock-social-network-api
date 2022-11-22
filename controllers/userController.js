const { Thought, User } = require('../models')

const formatDate = (date) => {
  return date.toLocaleDateString()
}

const formatReactionDate = (reactions) => {
  return reactions.map(reaction => {
    return {
      reactionBody: reaction.reactionBody,
      username: reaction.username,
      reactionId: reaction.reactionId,
      createdAt: formatDate(reaction.createdAt)
    }
  })
}

const formatThoughtDate = (thoughts) => {
  return thoughts.map(thought => {
    return {
      _id: thought._id,
      thoughtText: thought.thoughtText,
      username: thought.username,
      reactions: formatReactionDate(thought.reactions),
      createdAt: formatDate(thought.createdAt),
      reactionCount: thought.reactionCount
    }
  })
}

const getUsers = (req, res) => {
  User.find()
    .populate('thoughts')
    .then((users) => res.json(users.map(user => {
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        thoughts: formatThoughtDate(user.thoughts),
        friends: [...user.friends],
        friendCount: user.friendCount
      }
    })))
    .catch((err) => res.status(500).json(err));
}

const getSingleUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .populate('thoughts')
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          thoughts: formatThoughtDate(user.thoughts),
          friends: [...user.friends],
          friendCount: user.friendCount
        })
    )
    .catch((err) => res.status(500).json(err));
}

const createUser = (req, res) =>{
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
}

const updateUser = (req, res) => {
  const userId = req.params.userId
  User.findOneAndUpdate(
    { _id: userId},
    { $set: req.body },
    { new: true},
  )
  .then((user) =>
    !user
      ? res.status(404).json({ message: 'No user found with this id!' })
      : res.json(user)
  )
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
}

const deleteUser = (req, res) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : Thought.deleteMany({ _id: { $in: user.thoughts } })
    )
    .then(() => res.json({ message: 'User and thoughts deleted!' }))
    .catch((err) => res.status(500).json(err));
}

const addFriend = (req, res) => {
  const userId = req.params.userId, friendId = req.params.friendId;
  User.findOneAndUpdate(
    { _id: userId },
    { $push: { friends: friendId }},
    {new: true},
    (err, result) => {
      if (result) {
        res.status(200).json(result);
        console.log(`Added user friend: ${result}`);
      } else {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ message: 'something went wrong' });
      }
    }
  )
}

const removeFriend = (req, res) => {
  const userId = req.params.userId, friendId = req.params.friendId
  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { friends: friendId }},
    {new: true},
    (err, result) => {
      if (result) {
        res.status(200).json(result);
        console.log(`Added user friend: ${result}`);
      } else {
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ message: 'something went wrong' });
      }
    }
  )
}

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
};
