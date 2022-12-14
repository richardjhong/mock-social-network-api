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

const formatThoughtDate = (thoughts) => {
  return thoughts.map(thought => {
    return {
      ...thought._doc,
      reactions: formatReactionDate(thought._doc.reactions),
      createdAt: formatDate(thought._doc.createdAt),
    }
  })
}

const getUsers = (req, res) => {
  User.find()
    .populate('thoughts')
    .then((users) => res.json(users.map(user => {
      return {
        ...user._doc,
        thoughts: formatThoughtDate(user._doc.thoughts),
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
          ...user._doc,
          thoughts: formatThoughtDate(user._doc.thoughts),
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
