import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }
  findOneFull(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        capApplication: true,
        referralCode: {
          include: {
            referrals: true,
          },
        },
        xpTransactions: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  updateWallet(id: string, updateWalletDto: UpdateWalletDto) {
  return this.prisma.user.update({
    where: { id },
    data: {
      walletAddress: updateWalletDto.walletAddress,
    },
    include: {
      profile: true,
    },
  });
}
}
