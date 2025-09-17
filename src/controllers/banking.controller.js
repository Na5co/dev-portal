const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { bankingService } = require('../services');

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

const setFraudStatus = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const { status } = req.body;
  const result = await bankingService.setFraudStatus(identifier, status);
  res.status(httpStatus.OK).send(result);
});

const setCreditScore = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const { score } = req.body;
  const result = await bankingService.setCreditScore(identifier, score);
  res.status(httpStatus.OK).send(result);
});

const applyForLoan = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const result = await bankingService.applyForLoan(identifier, req.body);
  res.status(httpStatus.OK).send(result);
});

const reviewLoanApplication = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const { decision } = req.body;
  const result = await bankingService.reviewLoanApplication(identifier, decision);
  res.status(httpStatus.OK).send(result);
});

const getLoanApplications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bankingService.getLoanApplications(filter, options);
  res.send(result);
});

const updateUserProfile = catchAsync(async (req, res) => {
  const user = await bankingService.updateUserProfile(req.params.identifier, req.body);
  res.send(user);
});

const assessRisk = catchAsync(async (req, res) => {
  const assessment = await bankingService.assessRisk(req.params.identifier);
  res.send(assessment);
});

module.exports = {
  getFraudScore,
  getCreditScore,
  getTransactionHistory,
  setFraudStatus,
  setCreditScore,
  applyForLoan,
  reviewLoanApplication,
  getLoanApplications,
  updateUserProfile,
  assessRisk,
};
