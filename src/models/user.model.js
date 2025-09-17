const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    employmentStatus: {
      type: String,
      enum: ['employed', 'unemployed', 'self-employed', 'student'],
      default: 'unemployed',
    },
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    monthlyDebt: {
      type: Number,
      default: 0,
    },
    creditScore: {
      type: Number,
      default: 550, // Default to a low score
    },
    fraudStatus: {
      type: String,
      enum: ['high', 'low'],
      default: 'low',
    },
    loanDetails: {
      status: {
        type: String,
        enum: ['none', 'pending_assessment', 'pending_review', 'approved', 'declined'],
        default: 'none',
      },
      amount: {
        type: Number,
        default: 0,
      },
      purpose: {
        type: String,
      },
    },
    riskAssessment: {
      recommendation: {
        type: String,
        enum: ['none', 'proceed', 'proceed_with_caution', 'deny'],
      },
      assessedDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
