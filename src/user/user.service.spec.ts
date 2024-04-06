import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            getPrismaClient: jest.fn(),
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();
  
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
        biometricKey: null,
      });

      const result = await userService.createUser({ email, password });
      expect(result).toEqual({
        id: 1,
        email,
        password: hashedPassword,
        biometricKey: null,
      });
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const email = 'existing@example.com';

      prismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email,
        password: 'hashed_password',
        biometricKey: null,
      });

      await expect(userService.createUser({ email, password: 'password' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';

      prismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email,
        password: 'hashed_password',
        biometricKey: null,
      });

      const result = await userService.findByEmail(email);
      expect(result).toEqual({
        id: 1,
        email,
        password: 'hashed_password',
        biometricKey: null,
      });
    });

    it('should return null if user not found', async () => {
      const email = 'nonexistent@example.com';

      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findByEmail(email);
      expect(result).toBeNull();
    });
  });

  describe('findByBiometricKey', () => {
    it('should find a user by biometric key', async () => {
      const biometricKey = 'fingerprint123';

      prismaService.user.findFirst.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        biometricKey,
      });

      const result = await userService.findByBiometricKey(biometricKey);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        biometricKey,
      });
    });

    it('should return null if user not found', async () => {
      const biometricKey = 'nonexistent_key';

      prismaService.user.findFirst.mockResolvedValue(null);

      const result = await userService.findByBiometricKey(biometricKey);
      expect(result).toBeNull();
    });
  });
});
