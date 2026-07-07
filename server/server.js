import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server running smoothly' });
});

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('☘️  MongoDB Database connected successfully!');
    app.listen(PORT, () => console.log(`🚀 Server running securely on port ${PORT}`));
  })
  .catch((err) => console.error('❌ Database connection error:', err));