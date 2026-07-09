import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resultRouter from './routes/resultRoutes.js';
import questionRouter from './routes/questionRoutes.js';

const app = express();
const port = 4000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DATABASE
connectDB();
//ROUTES
app.use('/api/auth', userRouter);
app.use('/api/results', resultRouter);
app.use('/api/questions', questionRouter);

app.get('/', (req,res) => {
    res.send('API WORKING');
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})