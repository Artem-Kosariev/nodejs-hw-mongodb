import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  if (
    !process.env.MONGODB_USER ||
    !process.env.MONGODB_PASSWORD ||
    !process.env.MONGODB_DB ||
    !process.env.MONGODB_URL ||
    !process.env.PORT
  ) {
    console.error('Missing MongoDB credentials in the environment variables');
    process.exit(1);
  }

  const mongoURL = `${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(mongoURL);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection failed:', error.message);
    process.exit(1);
  }
};
