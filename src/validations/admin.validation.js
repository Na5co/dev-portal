const Joi = require('joi');
const { identifier } = require('./custom.validation');

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

module.exports = {
  setFraudStatus,
  setCreditScore,
  reviewLoanApplication,
  getLoanApplications,
  assessRisk,
  getRiskAssessments,
  getActiveLoans,
};
