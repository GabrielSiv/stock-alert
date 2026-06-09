import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AlertService } from './alert.service.js';
import { AlertRepository } from './alert.repository.js';
import { ValidationError } from '../../shared/AppError.js';
import {
  alertIdSchema,
  createAlertSchema,
  updateAlertSchema,
  userIdSchema,
} from './alert.schemas.js';

export class AlertController {
  private alertService: AlertService;

  constructor() {
    const alertRepository = new AlertRepository();
    this.alertService = new AlertService(alertRepository);
  }

  private parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
    try {
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) throw new ValidationError(z.treeifyError(error));
      throw error;
    }
  }

  async handleCreate(request: FastifyRequest, reply: FastifyReply) {
    const { userId, ticker, targetPrice } = this.parseBody(createAlertSchema, request.body);
    const result = await this.alertService.create({ userId, ticker, targetPrice });
    return reply.status(201).send(result);
  }

  async handleUpdate(request: FastifyRequest, reply: FastifyReply) {
    const { alertId, targetPrice, active } = this.parseBody(updateAlertSchema, request.body);

    const data = {
      ...(targetPrice !== undefined && { targetPrice }),
      ...(active !== undefined && { active }),
    };

    const result = await this.alertService.update(alertId, data);
    return reply.status(200).send(result);
  }

  async handleDelete(request: FastifyRequest, reply: FastifyReply) {
    const { alertId } = this.parseBody(alertIdSchema, request.body);
    await this.alertService.delete(alertId);
    return reply.status(204).send();
  }

  async handleGetByUser(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = this.parseBody(userIdSchema, request.body);
    const result = await this.alertService.findByUser(userId);
    return reply.status(200).send(result);
  }
}
