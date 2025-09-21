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

const applyForLoan = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
  body: Joi.object().keys({
    amount: Joi.number().required().positive(),
    purpose: Joi.string().required(),
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

const getLoanDecision = {
  params: Joi.object().keys({
    identifier: Joi.string().custom(identifier),
  }),
};

module.exports = {
  getFraudScore,
  getCreditScore,
  getTransactionHistory,
  applyForLoan,
  updateUserProfile,
  getLoanDecision,
};
