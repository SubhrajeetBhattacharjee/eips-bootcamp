import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardXpDto } from './dto/award-xp.dto';

@Injectable()
export class XpService {
  constructor(private readonly prisma: PrismaService) {}

  async awardXp(awardXpDto: AwardXpDto) {
    const { userId, amount, reason } = awardXpDto;

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the transaction
    const transaction = await this.prisma.xPTransaction.create({
      data: {
        userId,
        amount,
        reason,
      },
    });

    return transaction;
  }

  async getUserXp(userId: string) {
    const transactions = await this.prisma.xPTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalXp = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      userId,
      totalXp,
      transactions,
    };
  }
}
