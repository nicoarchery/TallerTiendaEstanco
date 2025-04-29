require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'default_secret',
  expiresIn: '1h'
};
