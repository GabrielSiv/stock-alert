import type { FastifyInstance } from 'fastify';
import { checkApiKey } from '../../infra/middlewares/auth.js';
import { AlertController } from './alert.controller.js';

export async function alertRoutes(app: FastifyInstance) {
  const alertController = new AlertController();
  app.addHook('preHandler', checkApiKey);

  app.post('/create', alertController.handleCreate.bind(alertController));
  app.post('/list', alertController.handleGetByUser.bind(alertController));
  app.patch('/update', alertController.handleUpdate.bind(alertController));
  app.delete('/delete', alertController.handleDelete.bind(alertController));
}
