import { app } from './app';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('jwt key not defined!');
  if (!process.env.DB_URI) throw new Error('uri key not defined!');
  try {
    await mongoose.connect(process.env.DB_URI);

    app.listen(3000, () => {
      console.log('Auth Services listening to port 3000!');
    });
  } catch (e) {
    console.error(e);
  }
};

start();
