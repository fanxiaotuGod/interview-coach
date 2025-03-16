import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import './initDb.js'; 
import interviewRoutes from './routes/interview.js';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/', interviewRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
