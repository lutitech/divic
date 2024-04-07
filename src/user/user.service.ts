import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // Constructor to inject PrismaService
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Create a new user
  async createUser({ email, password, biometricKey }: Partial<User>): Promise<User> {
    try {
      // Check if user with the email already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the user in the database
      const createdUser = await this.prisma.getPrismaClient().user.create({
        data: {
          email,
          password: hashedPassword,
          biometricKey: biometricKey,
        },
      });
      return createdUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  // Find a user by their email
  async findByEmail(email: string): Promise<User | null> {
    try {
      // Query the database for the user with the specified email
      const user = await this.prisma.getPrismaClient().user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  // Find a user by their biometric key
  async findByBiometricKey(biometricKey: string): Promise<User | null> {
    try {
      // Query the database using the decrypted biometric key
      const user = await this.prisma.getPrismaClient().user.findFirst({
        where: { biometricKey: biometricKey },
      });
      return user;
    } catch (error) {
      console.error('Error in findByBiometricKey:', error);
      throw new UnauthorizedException('Invalid biometric credentials');
    }
  }
  
}