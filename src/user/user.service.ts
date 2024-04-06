import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(public readonly prisma: PrismaService) {}

  /**
   * Creates a new user.
   * @param user - The user data including email, password, and optional biometric key.
   * @returns The created user.
   * @throws UnauthorizedException if a user with the same email already exists.
   */
  async createUser({ email, password, biometricKey }: Partial<User>): Promise<User> {
    try {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await this.prisma.getPrismaClient().user.create({
        data: {
          email,
          password: hashedPassword,
          biometricKey,
        },
      });
      return createdUser;
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in createUser:', error);
      // Throw the error to propagate it further
      throw error;
    }
  }
  

  /**
   * Finds a user by email.
   * @param email - The user's email.
   * @returns The user if found, otherwise null.
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await await this.prisma.getPrismaClient().user.findUnique({
      where: { email },
    });
    return user;
  }

  /**
   * Finds a user by biometric key.
   * @param biometricKey - The user's biometric key.
   * @returns The user if found, otherwise null.
   */
  async findByBiometricKey(biometricKey: string): Promise<User | null> {
    const user = await this.prisma.getPrismaClient().user.findFirst({
      where: { biometricKey },
    });
    return user;
  }
}
