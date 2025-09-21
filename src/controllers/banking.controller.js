const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { bankingService, userService } = require('../services');

const getFraudScore = catchAsync(async (req, res) => {
  const score = await bankingService.getFraudScore(req.params.identifier);
  res.status(httpStatus.OK).send(score);
});

const getCreditScore = catchAsync(async (req, res) => {
  const score = await bankingService.getCreditScore(req.params.identifier);
  res.status(httpStatus.OK).send(score);
});

const getTransactionHistory = catchAsync(async (req, res) => {
  const history = await bankingService.getTransactionHistory(req.params.identifier);
  res.status(httpStatus.OK).send(history);
});

const applyForLoan = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const result = await bankingService.applyForLoan(identifier, req.body);
  res.status(httpStatus.OK).send(result);
});

const updateUserProfile = catchAsync(async (req, res) => {
  const user = await bankingService.updateUserProfile(req.params.identifier, req.body);
  res.send(user);
});

const getLoanDecision = catchAsync(async (req, res) => {
  const result = await bankingService.getLoanDecision(req.params.identifier);
  res.send(result);
});

module.exports = {
  getFraudScore,
  getCreditScore,
  getTransactionHistory,
  applyForLoan,
  updateUserProfile,
  getLoanDecision,
};
