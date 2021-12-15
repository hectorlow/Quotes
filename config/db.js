const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connect to mongodb: ${conn.connection.host}`);
}

module.exports = connectDB;