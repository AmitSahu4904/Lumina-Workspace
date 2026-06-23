import app from './app';
import env from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`Lumina Workspace Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful Shutdown Handlers
const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
