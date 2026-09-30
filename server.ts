import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './backend/routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security and parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Standard security headers without blocking Vite scripts
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes
app.use('/api', apiRouter);
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.path.startsWith('/api') || res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err && typeof err === 'object' && 'status' in err &&
    typeof err.status === 'number' && err.status >= 400 && err.status < 500
    ? err.status
    : 500;
  const message = statusCode < 500 && err instanceof Error
    ? err.message
    : 'Internal server error.';

  res.status(statusCode).json({ error: message });
});

// Development with Vite middleware or Production static serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`RailPredict AI server running on http://0.0.0.0:${PORT}`);
    console.log(`Data Source Mode: ${process.env.DATA_SOURCE_MODE || 'DEMO'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
