import express from 'express';
import userRoute from './routes/user.route.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.MONGO).then(() => {
    console.log('MongoDB connected successfully!!');
  })
  .catch((err) => {   
    console.log('MongoDB connection failed!!');
    console.log(err);
  });  

const app = express();

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user', userRoute)
