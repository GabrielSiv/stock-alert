import type { FastifyReply, FastifyRequest } from 'fastify';

export async function checkApiKey(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-api-key'];
  const expectedKey = process.env.API_ACCESS_KEY;

  if (!expectedKey) {
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Chave de acesso à API não configurada no servidor.',
    });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Acesso negado: Chave de API inválida ou ausente no header x-api-key.',
    });
  }
}
