import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import cors from 'cors'; // Import CORS


dotenv.config();

const app = express();

app.use(bodyParser.json());

// CORS Configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
