import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const bootstrap = async () => {
  try {
    await initMongoConnection();

    setupServer();

    const PORT = process.env.PORT || 3000;
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error during application bootstrap:', error);
    process.exit(1);
  }
};

bootstrap();
