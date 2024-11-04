import { Application } from './app';
// import { Logger } from './core/logger/logger.service';

async function bootstrap() {
  const app = new Application();
  try {
    app.init();
    await app.start();
  } catch (err) {
    console.error(err);
  }
}

bootstrap();

process.on('uncaughtException', (error) => {
  console.log('uncaughtException', error);
});

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error);
});
