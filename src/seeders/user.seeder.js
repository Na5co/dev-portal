const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const { User } = require('../models');
const logger = require('../config/logger');

const adminId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();

const users = [
  {
    _id: adminId,
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password1',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    _id: userId,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password1',
    role: 'user',
    isEmailVerified: true,
  },
  {
    name: 'Declan Riske',
    email: 'declan@example.com',
    password: 'password1',
    role: 'user',
    isEmailVerified: true,
    address: { street: '101 Red Flag Way', city: 'Riskyville', state: 'FL', zipCode: '33101' },
    employmentStatus: 'unemployed',
    monthlyIncome: 1000,
    monthlyDebt: 800,
    creditScore: 550,
    fraudStatus: 'high',
  },
  {
    name: 'Penny Review',
    email: 'penny@example.com',
    password: 'password1',
    role: 'user',
    isEmailVerified: true,
    address: { street: '456 Borderline Blvd', city: 'Maybeburg', state: 'OH', zipCode: '43004' },
    employmentStatus: 'employed',
    monthlyIncome: 6250,
    monthlyDebt: 2500,
    creditScore: 680,
    fraudStatus: 'low',
  },
  {
    name: 'Apollo Pruitt',
    email: 'apollo@example.com',
    password: 'password1',
    role: 'user',
    isEmailVerified: true,
    address: { street: '789 Golden Ave', city: 'Trustworth', state: 'CA', zipCode: '90210' },
    employmentStatus: 'employed',
    monthlyIncome: 12500,
    monthlyDebt: 1000,
    creditScore: 800,
    fraudStatus: 'low',
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log('Successfully seeded users');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();
