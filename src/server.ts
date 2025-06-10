import { buildApp } from './app';

async function start(): Promise<void> {
  try {
    const app = await buildApp();
    app.log.info('Successfully built fastify instance');

    await app.listen({
      host: app.config.HOST,
      port: app.config.PORT,
    });
  } catch (err) {
    console.error('Error occurred during server startup', err);
    process.exit(1);
  }
}

start();
