const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userService } = require('../services');

const authorizeBanking = async (req, res, next) => {
  const { user } = req;
  const { identifier } = req.params;

  // Admins can access any user's data
  if (user.role === 'admin') {
    return next();
  }

  // Regular users can only access their own data
  const targetUser = await userService.getUserByIdentifier(identifier);
  if (!targetUser || user.id !== targetUser.id) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }

  next();
};

module.exports = authorizeBanking;
