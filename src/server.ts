import { Server as HTTPServer } from 'http';
import app from './app';
import config from './config';
import { testConnection } from './config/db';

let server: HTTPServer;

async function main() {
  try {
    //DB connection
    await testConnection();

    // Start Express server
    server = app.listen(config.port, () => {
      console.log(`App is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Error starting the server:', err);
  }
}

main();

// Graceful Shutdown
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection detected. Shutting down...', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception detected. Shutting down...', err);
  process.exit(1);
});
