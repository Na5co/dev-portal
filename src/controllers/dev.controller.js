const { exec } = require('child_process');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const seedDatabase = catchAsync(async (req, res) => {
  if (req.user.email !== 'atanas1899@gmail.com') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  exec('npm run db:seed', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error seeding database: ${error.message}` });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error seeding database: ${stderr}` });
    }
    console.log(`stdout: ${stdout}`);
    res.status(httpStatus.OK).send({ message: 'Database seeded successfully!', details: stdout });
  });
});

module.exports = {
  seedDatabase,
};
