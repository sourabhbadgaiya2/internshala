const mongoose = require('mongoose');

exports.connectedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database is Connected`);
  } catch (error) {
    console.log(error.message);
  }
};
