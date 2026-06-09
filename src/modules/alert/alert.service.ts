import { ConflictError, NotFoundError } from '../../shared/AppError.js';
import { AlertRepository } from './alert.repository.js';

interface AlertSchema {
  userId: string;
  ticker: string;
  targetPrice: number;
  active?: boolean;
}

export class AlertService {
  constructor(private alertRepository: AlertRepository) {}

  async findByUser(userId: string) {
    const alerts = await this.alertRepository.findAlertsByUser(userId);

    if (alerts) {
      return {
        alerts,
      };
    } else {
      throw new NotFoundError('Nenhum alerta encontrado para o usuário');
    }
  }

  async create({ userId, ticker, targetPrice }: AlertSchema) {
    const exists = await this.alertRepository.findAlertByTicker(userId, ticker);
    if (exists) {
      throw new ConflictError('Alerta já cadastrado para esse ticker.');
    }
    return await this.alertRepository.createAlert({ userId, ticker, targetPrice });
  }

  async update(alertId: string, data: { targetPrice?: number; active?: boolean }) {
    const exists = await this.alertRepository.findAlertById(alertId);

    if (!exists) {
      throw new NotFoundError('Alerta não encontrado.');
    }
    return this.alertRepository.updateAlert(alertId, data);
  }

  async delete(alertId: string) {
    const exists = await this.alertRepository.findAlertById(alertId);

    if (!exists) {
      throw new NotFoundError('Alerta não encontrado.');
    }
    return this.alertRepository.deleteAlert(alertId);
  }
}
