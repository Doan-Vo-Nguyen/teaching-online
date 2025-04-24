import { Application } from './app';
import { Logger } from './modules/config/logger';

/**
 * Bootstrap function to initialize and start the application
 */
async function bootstrap() {
  try {
    // Get the singleton instance
    const app = Application.getInstance();
    
    // Initialize the application
    app.init();
    
    // Start the application
    await app.start();
    
    Logger.info('Application started successfully');
  } catch (error: any) {
    Logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: any) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: any) => {
  Logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the application
bootstrap();
