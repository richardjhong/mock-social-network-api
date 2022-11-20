const { Thought, User } = require('../models')

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
}

const getSingleUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
}


const createUser = (req, res) =>{
  User.create(req.body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.status(500).json(err));
}

const updateUser = (req, res) => {
  const userId = req.params.userId
  User.findOneAndUpdate(
    userId,
    { $set: req.body },
    { new: true},
    (err, result) => {
      if (result) {
        res.status(200).json(result);
        console.log(`Updated user: ${result}`);
      } else {
        console.log('Uh Oh, updating user went wrong');
        res.status(500).json({ message: 'updating user went wrong' });
      }
    }
  )
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
  const userId = req.params.userIdfriendId = req.params.friendId
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
