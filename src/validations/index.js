module.exports.customValidation = require('./custom.validation');
const authValidation = require('./auth.validation');
const userValidation = require('./user.validation');
const bankingValidation = require('./banking.validation');
const adminValidation = require('./admin.validation');

module.exports = {
  authValidation,
  userValidation,
  bankingValidation,
  adminValidation,
};
