import { Application } from './app';
import { Logger } from './modules/config/logger';

async function bootstrap() {
  const app = new Application();
  try {
    app.init();
    await app.start();
  } catch (err) {
    Logger.error(err);
  }
}

bootstrap();

process.on('uncaughtException', (error) => {
  console.error('uncaughtException', error);
});

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', error);
});
