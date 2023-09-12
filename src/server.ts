import express from 'express';
// import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './config/default';

import router from './router';
import { errorMiddleware } from './middlewares/error-middleware';

// import { harperGetMessages, harperSaveMessages } from './services/harper';

const PORT = process.env.PORT || config.port || 6000;
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
  })
);
app.use('/api', router);
app.use(errorMiddleware);

app.get('/test', (_, res) => {
  res.send(`this is backend`);
});

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
