import Fastify from 'fastify';
import cors from '@fastify/cors';
import { loadRoutes } from './utils/route-loader';

const PORT = process.env.PORT || 4321;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  // Register CORS
  await server.register(cors, { origin: true });

  // Register routes
  await loadRoutes(server);

  // Health check route
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  try {
    await server.listen({ port: Number(PORT), host: HOST });
    console.log(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
