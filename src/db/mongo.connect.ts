import mongoose from 'mongoose';
import { config } from '../config.js';

export const dbConnect = () => {
  const uri = `mongodb+srv://${config.user}:${config.passwd}@${config.cluster}/${config.dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
