import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server running smoothly' });
});

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    app.listen(PORT, () => console.log(`Server running securely on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));