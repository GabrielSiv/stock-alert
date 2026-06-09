import { prisma } from '../../shared/prisma.js';

interface AlertSchema {
  userId: string;
  ticker: string;
  targetPrice: number;
  active?: boolean;
}

export class AlertRepository {
  async createAlert({ userId, ticker, targetPrice }: AlertSchema) {
    return prisma.alert.create({
      data: {
        userId,
        ticker,
        targetPrice,
      },
    });
  }

  async findAlertsByUser(userId: string) {
    return prisma.alert.findMany({
      where: { userId },
      orderBy: { active: 'desc' },
    });
  }

  async findAlertById(alertId: string) {
    return prisma.alert.findUnique({
      where: { id: alertId },
    });
  }

  async findAlertByTicker(ticker: string, userId: string) {
    return prisma.alert.findUnique({
      where: {
        userId_ticker: {
          userId,
          ticker,
        },
      },
    });
  }

  async updateAlert(alertId: string, data: { targetPrice?: number; active?: boolean }) {
    return prisma.alert.update({
      where: { id: alertId },
      data,
    });
  }

  async deleteAlert(alertId: string) {
    return prisma.alert.delete({
      where: { id: alertId },
    });
  }
}
