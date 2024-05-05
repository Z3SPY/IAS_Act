import { config } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

// Load environment variables
config();

const app = express();

app.get('/', (req, res) => {
  res.json({ data: 'data' });
});

const connectionString = process.env.MONGODB_URI_CONNECTION_STRING;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
