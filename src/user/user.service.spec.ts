
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should create a new user', async () => {
    // Mock PrismaService methods
    const mockedCreate = jest.spyOn(userService.prisma.getPrismaClient().user, 'create').mockResolvedValue({} as User);
    const mockedFindUnique = jest.spyOn(userService.prisma.getPrismaClient().user, 'findUnique').mockResolvedValue(null);

    // Mock hashed password
    const hashedPassword = 'hashedPassword';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

    // Mock input data
    const email = 'test@example.com';
    const password = 'password';
    const biometricKey = 'biometricKey';

    // Call createUser method
    await expect(userService.createUser(email, password, biometricKey)).resolves.not.toThrow();

    // Verify PrismaService methods are called with correct parameters
    expect(mockedFindUnique).toHaveBeenCalledWith(email);
    expect(mockedCreate).toHaveBeenCalledWith({
      data: {
        email,
        password: hashedPassword,
        biometricKey,
      },
    });
  });

  it('should throw UnauthorizedException if user already exists', async () => {
    // Mock PrismaService methods to return an existing user
    const existingUser: User = {
      id: 1,
      email: 'existing@example.com',
      password: 'hashedPassword',
      biometricKey: 'existingBiometricKey',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(userService.prisma.getPrismaClient().user, 'findUnique').mockResolvedValue(existingUser);

    // Mock input data
    const email = 'existing@example.com';
    const password = 'password';
    const biometricKey = 'biometricKey';

    // Call createUser method and expect it to throw UnauthorizedException
    await expect(userService.createUser(email, password, biometricKey)).rejects.toThrow(UnauthorizedException);
  });

  // Write similar tests for other scenarios if needed
});