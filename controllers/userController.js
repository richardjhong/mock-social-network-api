const User = require('../models/User');

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
        console.log('Uh Oh, something went wrong');
        res.status(500).json({ message: 'something went wrong' });
      }
    }
  )
}

const deleteUser = (req, res) => {
  const userId = req.params.userId
  User.findByIdAndDelete(userId, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).json(result);
      console.log("Deleted : ", result);
    }
  })
}

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
};
