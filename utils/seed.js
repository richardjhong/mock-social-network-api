const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomEmail, getRandomUserName } = require('./data');

// Start the seeding runtime timer
console.time('seeding');

// Creates a connection to mongodb
connection.once('open', async () => {
  // Delete the entries in the collection
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Empty arrays for randomly generated users
  const users = [];
  const usedEmails = [];

  for (let i = 0; i < 10; i++) {
    const username = getRandomUserName();
    let email = getRandomEmail();
    if (usedEmails.indexOf(email) !== -1) {
      while (usedEmails.indexOf(email) !== -1) {
        email = getRandomEmail();
      }
    }

    usedEmails.push(email)
    const newUser = {
      username: username,
      email: email,
      thoughts: [],
      friends: []
    };
    users.push(newUser);
  }

  // Wait for the users to be inserted into the database
  await User.collection.insertMany(users);

  console.table(users);
  console.timeEnd('seeding complete 🌱');
  process.exit(0);
});
