
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}
  async createUser(email: string, password: string, biometricKey?: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    return this.prisma.getPrismaClient().user.create({
      data: {
        email,
        password: hashedPassword,
        biometricKey,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.getPrismaClient().user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByBiometricKey(biometricKey: string): Promise<User | null> {
    return this.prisma.getPrismaClient().user.findFirst({
      where: {
        biometricKey,
      },
    });
  }
}
