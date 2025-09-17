const Joi = require('joi');
const { objectId, identifier } = require('./custom.validation');

const getFraudScore = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
};

const getCreditScore = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
};

const getTransactionHistory = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
};

const setFraudStatus = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
  body: Joi.object().keys({
    status: Joi.string().required().valid('fraud', 'not_fraud'),
  }),
};

const setCreditScore = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
  body: Joi.object().keys({
    score: Joi.number().required().min(300).max(850),
  }),
};

const applyForLoan = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
  body: Joi.object().keys({
    amount: Joi.number().required().positive(),
    purpose: Joi.string().required(),
  }),
};

const reviewLoanApplication = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
  body: Joi.object().keys({
    decision: Joi.string().required().valid('approved', 'declined'),
  }),
};

const getLoanApplications = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending_review', 'approved', 'declined'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateUserProfile = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
  body: Joi.object().keys({
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
    }).required(),
    employmentStatus: Joi.string().required().valid('employed', 'unemployed', 'self-employed', 'student'),
    monthlyIncome: Joi.number().required().min(0),
    monthlyDebt: Joi.number().required().min(0),
  }),
};

const assessRisk = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
};

const getRiskAssessments = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending_assessment', 'pending_review', 'approved', 'declined'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getActiveLoans = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLoanDecision = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
};

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
  getRiskAssessments,
  getActiveLoans,
  getLoanDecision,
};
