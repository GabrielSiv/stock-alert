import Fastify from 'fastify';
import { ZodError } from 'zod';
import { z } from 'zod';
import { AppError, ValidationError } from './shared/AppError.js';
import { userRoutes } from './modules/user/user.routes.js';

const app = Fastify({ logger: true });

app.register(userRoutes, { prefix: '/users' });

app.setErrorHandler((error, _req, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  if (error instanceof ZodError) {
    return reply.status(422).send({
      message: 'Erro de validação de dados.',
      errors: z.treeifyError(error),
    });
  }

  app.log.error(error);
  return reply.status(500).send({ message: 'Erro interno do servidor.' });
});

const port = Number(process.env['PORT']) || 3000;
const host = process.env['HOST'] ?? '0.0.0.0';

await app.listen({ port, host });
