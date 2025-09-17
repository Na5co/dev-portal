const { User } = require('../models');
const { userService } = require('.');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

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
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // A user can only apply if they don't have an active or pending application.
  if (user.loanDetails.status !== 'none' && user.loanDetails.status !== 'declined') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already has a pending or approved loan application.');
  }

  // A user must have a complete profile before applying for a loan.
  if (!user.address || !user.employmentStatus || user.monthlyIncome === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User profile is incomplete. Please submit your financial profile before applying for a loan.'
    );
  }

  // Set loan details and mark it as pending assessment.
  user.loanDetails.amount = loanData.amount;
  user.loanDetails.purpose = loanData.purpose;
  user.loanDetails.status = 'pending_assessment'; // Now an admin needs to run the assessment.
  await user.save();

  return { status: 'pending_assessment', message: 'Your loan application has been submitted and is pending a risk assessment.' };
};

const reviewLoanApplication = async (identifier, decision) => {
  const user = await userService.getUserByIdentifier(identifier);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // ABSOLUTE CHECK: An admin can only review a loan if and only if:
  // 1. A risk assessment object exists (meaning it has been completed).
  // 2. The assessment's recommendation was "proceed_with_caution".
  // 3. The loan's current status is "pending_review".
  if (
    !user.riskAssessment ||
    user.riskAssessment.recommendation !== 'proceed_with_caution' ||
    user.loanDetails.status !== 'pending_review'
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This loan application cannot be manually reviewed. It has either not been assessed or the automated assessment did not require manual intervention.'
    );
  }

  user.loanDetails.status = decision;
  await user.save();
  return user.loanDetails;
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
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if there is a loan application to assess.
  if (user.loanDetails.status !== 'pending_assessment') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No loan application is pending assessment for this user.');
  }

  if (!user.address || !user.employmentStatus || user.monthlyIncome === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User profile is incomplete. Cannot assess risk.');
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

  // Create the assessment object on the user model
  user.riskAssessment = {
    recommendation,
    assessedDate: new Date(),
  };

  // Update loan status based on assessment recommendation
  if (recommendation === 'deny') {
    user.loanDetails.status = 'declined';
  } else if (recommendation === 'proceed_with_caution') {
    user.loanDetails.status = 'pending_review';
  } else {
    // 'proceed'
    user.loanDetails.status = 'approved';
  }

  await user.save();

  return {
    userId: user.id,
    riskLevel,
    recommendation,
    loanStatus: user.loanDetails.status,
    assessment,
  };
};

const getRiskAssessments = async (filter, options) => {
  // This endpoint should show all applications that require an admin's attention,
  // either for assessment or for manual review.
  const query = {
    'loanDetails.status': { $in: ['pending_assessment', 'pending_review', 'approved', 'declined'] },
  };

  if (filter.status) {
    query['loanDetails.status'] = filter.status;
  }

  const assessments = await User.paginate(query, options);
  return assessments;
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
};
