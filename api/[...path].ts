import express from 'express';
import { apiRouter } from '../backend/routes/api.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
app.use((req, _res, next) => {
  if (!req.path.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  next();
});
app.use('/api', apiRouter);

export default app;
