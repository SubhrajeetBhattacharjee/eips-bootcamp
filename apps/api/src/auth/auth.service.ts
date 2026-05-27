import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(syncUserDto: SyncUserDto) {
  const { clerkId, email, username } = syncUserDto;

  const existingClerkUser = await this.prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      profile: true,
    },
  });

  if (existingClerkUser) {
    return this.prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        email,
        username,
      },
      include: {
        profile: true,
      },
    });
  }

  const existingEmailUser = await this.prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });

  if (existingEmailUser) {
    return this.prisma.user.update({
      where: {
        email,
      },
      data: {
        clerkId,
        username,
      },
      include: {
        profile: true,
      },
    });
  }

  return this.prisma.user.create({
    data: {
      clerkId,
      email,
      username,
    },
    include: {
      profile: true,
    },
  });
}
}
