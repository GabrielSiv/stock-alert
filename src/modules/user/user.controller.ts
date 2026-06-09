import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { ValidationError } from '../../shared/AppError.js';

const userBodySchema = z.object({
  email: z.email({ message: 'Email inválido.' }),
});

export class UserController {
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository();
    this.userService = new UserService(userRepository);
  }

  private parseBody(body: unknown) {
    try {
      return userBodySchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) throw new ValidationError(z.treeifyError(error));
      throw error;
    }
  }

  async handleCreate(request: FastifyRequest, reply: FastifyReply) {
    const { email } = this.parseBody(request.body);
    const { user, created } = await this.userService.create({ email });
    return reply.status(created ? 201 : 200).send(user);
  }

  async handleFind(request: FastifyRequest, reply: FastifyReply) {
    const { email } = this.parseBody(request.body);
    const result = await this.userService.find({ email });
    return reply.status(200).send(result);
  }
}
