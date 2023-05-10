import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB connected successfully`);
  } catch (err) {
    console.log(`DB connection fails: ${err.message}`);
    process.exit();
  }
};

export default dbConnection;
