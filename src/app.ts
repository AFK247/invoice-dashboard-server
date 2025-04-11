import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes/routes';
import globalErrorHandler from './middleware/globalErrorhandler';
import notFound from './middleware/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors());
app.use(express.json());

//parsers
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: '*', // Allow requests from any origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   }),
// );

// Application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hi This is root Route');
});

app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
