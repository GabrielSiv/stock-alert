import type { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';
import { checkApiKey } from '../../infra/middlewares/auth.js';
