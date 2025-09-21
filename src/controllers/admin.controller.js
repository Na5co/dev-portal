const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { bankingService } = require('../services');

const setFraudStatus = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const { status } = req.body;
  const result = await bankingService.setFraudStatus(identifier, status);
  res.status(200).send(result);
});

const setCreditScore = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const { score } = req.body;
  const result = await bankingService.setCreditScore(identifier, score);
  res.status(200).send(result);
});

const reviewLoanApplication = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  const { decision } = req.body;
  const result = await bankingService.reviewLoanApplication(identifier, decision);
  res.status(200).send(result);
});

const getLoanApplications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bankingService.getLoanApplications(filter, options);
  res.send(result);
});

const assessRisk = catchAsync(async (req, res) => {
  const assessment = await bankingService.assessRisk(req.params.identifier);
  res.send(assessment);
});

const getRiskAssessments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bankingService.getRiskAssessments(filter, options);
  res.send(result);
});

const getActiveLoans = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bankingService.getActiveLoans(options);
  res.send(result);
});

module.exports = {
  setFraudStatus,
  setCreditScore,
  reviewLoanApplication,
  getLoanApplications,
  assessRisk,
  getRiskAssessments,
  getActiveLoans,
};
