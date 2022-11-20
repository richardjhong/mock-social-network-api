const { connect, connection } = require('mongoose');

connect('mongodb://127.0.0.1:27017/social-networkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
