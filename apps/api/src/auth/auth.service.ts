import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(syncUserDto: SyncUserDto) {
    const { id, email, username } = syncUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });

    if (existingUser) {
      return this.prisma.user.update({
        where: { id },
        data: { email, username },
        include: { profile: true },
      });
    }

    return this.prisma.user.create({
      data: {
        id,
        email,
        username,
      },
      include: { profile: true },
    });
  }
}
