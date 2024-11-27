import fastify from 'fastify';
import { loadConfig } from './config/env';

loadConfig();

const host = String(process.env.API_HOST);
const port = Number(process.env.API_PORT);

const init = async () => {
  const server = fastify({
    logger: true,
  });

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  try {
    await server.listen({ host, port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection: ', err);
  process.exit(1);
});

init();
