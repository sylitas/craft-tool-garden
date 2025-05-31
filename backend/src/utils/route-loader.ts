import { FastifyInstance } from 'fastify';
import apiDefinitions from '../api-definitions.json';

type HandlerMap = {
  [key: string]: {
    [handlerName: string]: (request: any, reply: any) => Promise<any>;
  };
};

export async function loadRoutes(server: FastifyInstance) {
  // Import all handler modules
  const handlers: HandlerMap = {
    'produce-kafka-message': await import(
      '../routes/produce-kafka-message/handlers'
    ),
  };

  // Register routes from API definitions
  Object.entries(apiDefinitions).forEach(([toolName, toolConfig]) => {
    const { basePath, endpoints } = toolConfig;

    if (!handlers[toolName]) {
      server.log.warn(`No handlers found for tool: ${toolName}`);
      return;
    }

    endpoints.forEach((endpoint) => {
      const { path, method, handler: handlerName } = endpoint;
      const handlerFunction = handlers[toolName][handlerName];

      if (!handlerFunction) {
        server.log.warn(
          `Handler ${handlerName} not found for ${method} ${basePath}${path}`
        );
        return;
      }

      server.route({
        url: `${basePath}${path}`,
        method: method as any,
        handler: handlerFunction,
      });

      server.log.info(`Registered route: ${method} ${basePath}${path}`);
    });
  });
}
