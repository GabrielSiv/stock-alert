import type { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';
import { checkApiKey } from '../../infra/middlewares/auth.js';

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController();
  app.addHook('preHandler', checkApiKey);

  app.post('/create_find_user', userController.handleCreate.bind(userController));
}
