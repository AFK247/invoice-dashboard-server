import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes/routes';
import globalErrorHandler from './middleware/globalErrorhandler';
import notFound from './middleware/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

// app.use(cors());
app.use(express.json());

//parsers
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'https://invoice-dashboard-amber.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS policy violation'), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hi This is root Route');
});

app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
