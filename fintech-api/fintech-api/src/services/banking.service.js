const { User } = require('../models');
const { userService } = require('.');

const getFraudScore = async (identifier) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }
  return { userId: user.id, fraudStatus: user.fraudStatus };
};

const getCreditScore = async (identifier) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }
  return { userId: user.id, creditScore: user.creditScore };
};

const getTransactionHistory = async (identifier) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }
  // Mock transaction history
  const transactions = [
    { id: 'txn_1', amount: 100, description: 'Purchase at Store A', date: new Date() },
    { id: 'txn_2', amount: 50, description: 'Purchase at Store B', date: new Date(Date.now() - 86400000) },
  ];
  return { userId: user.id, transactions };
};

const setFraudStatus = async (identifier, status) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }
  user.fraudStatus = status;
  await user.save();
  return { userId: user.id, fraudStatus: user.fraudStatus };
};

const setCreditScore = async (identifier, score) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }
  user.creditScore = score;
  await user.save();
  return { userId: user.id, creditScore: user.creditScore };
};

const applyForLoan = async (identifier, loanData) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }

  // Prerequisite check: Ensure an admin has completed the risk assessment
  if (user.riskAssessment.status !== 'complete') {
    throw new Error('A risk assessment must be completed by an admin before applying for a loan.');
  }

  if (user.loanDetails.status !== 'none' && user.loanDetails.status !== 'declined') {
    throw new Error('User already has a pending or approved loan application.');
  }

  // --- Decision Logic based on saved risk assessment ---
  const { recommendation } = user.riskAssessment;
  user.loanDetails.amount = loanData.amount;
  user.loanDetails.purpose = loanData.purpose;

  if (recommendation === 'deny') {
    user.loanDetails.status = 'declined';
    await user.save();
    return { status: 'declined', reason: 'Application declined based on prior risk assessment.' };
  }

  if (recommendation === 'proceed_with_caution') {
    user.loanDetails.status = 'pending_review';
    await user.save();
    return { status: 'pending_review', reason: 'Application requires manual review based on prior risk assessment.' };
  }

  // Recommendation is "proceed"
  user.loanDetails.status = 'approved';
  await user.save();
  return { status: 'approved', message: 'Congratulations! Your loan has been approved based on prior risk assessment.' };
};

const reviewLoanApplication = async (identifier, decision) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.loanDetails.status !== 'pending_review') {
    throw new Error(`Loan application is not pending review. Current status: ${user.loanDetails.status}`);
  }

  user.loanDetails.status = decision;
  await user.save();

  return { userId: user.id, loanStatus: user.loanDetails.status };
};

const getLoanApplications = async (filter, options) => {
  const finalFilter = { 'loanDetails.status': { $ne: 'none' } };
  if (filter.status) {
    finalFilter['loanDetails.status'] = filter.status;
  }
  const applications = await User.paginate(finalFilter, options);
  return applications;
};

const updateUserProfile = async (identifier, profileData) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, profileData);
  await user.save();
  return user;
};

const assessRisk = async (identifier) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.address || !user.employmentStatus || user.monthlyIncome === 0) {
    throw new Error('User profile is incomplete. Cannot assess risk.');
  }

  const assessment = {
    creditScoreCheck: 'pass',
    dtiRatioCheck: 'pass',
    fraudFlags: [],
  };

  // Credit Score Check
  if (user.creditScore < 600) {
    assessment.creditScoreCheck = 'fail';
    assessment.fraudFlags.push('low_credit_score');
  } else if (user.creditScore < 650) {
    assessment.creditScoreCheck = 'borderline';
  }

  // DTI Ratio Check
  const debtToIncomeRatio = (user.monthlyDebt / user.monthlyIncome) * 100;
  if (debtToIncomeRatio > 40) {
    assessment.dtiRatioCheck = 'fail';
    assessment.fraudFlags.push('high_dti_ratio');
  } else if (debtToIncomeRatio > 30) {
    assessment.dtiRatioCheck = 'borderline';
  }

  // Fraud Status Check
  if (user.fraudStatus === 'high') {
    assessment.fraudFlags.push('high_fraud_status');
  }
  if (user.employmentStatus === 'unemployed') {
    assessment.fraudFlags.push('unemployed_status');
  }

  // Determine Overall Risk Level and Recommendation
  let riskLevel = 'low';
  let recommendation = 'proceed';

  if (assessment.fraudFlags.length > 0) {
    riskLevel = 'high';
    recommendation = 'deny';
  } else if (assessment.creditScoreCheck === 'borderline' || assessment.dtiRatioCheck === 'borderline') {
    riskLevel = 'medium';
    recommendation = 'proceed_with_caution';
  }

  // Save the assessment to the user model
  user.riskAssessment.status = 'complete';
  user.riskAssessment.recommendation = recommendation;
  user.riskAssessment.assessedDate = new Date();
  await user.save();

  return {
    userId: user.id,
    riskLevel,
    recommendation,
    assessment,
  };
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
};
