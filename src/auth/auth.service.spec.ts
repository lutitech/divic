// Assuming you are using Jest for testing

// Import the necessary modules and classes
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            findByBiometricKey: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should authenticate a user with valid email and password', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const user = { id: 1, email, password: await bcrypt.hash(password, 10) };

      userService.findByEmail = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwtService.sign = jest.fn().mockReturnValue('testtoken');

      const result = await authService.login(email, password);

      expect(result).toBe('testtoken');
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ email, sub: user.id });
    });

    it('should throw UnauthorizedException if email or password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      userService.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('biometricLogin', () => {
    it('should authenticate a user with valid biometric credentials', async () => {
      const biometricKey = 'testbiometrickey';
      const user = { id: 1, email: 'test@example.com' };

      userService.findByBiometricKey = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue('testtoken');

      const result = await authService.biometricLogin(biometricKey);

      expect(result).toBe('testtoken');
      expect(userService.findByBiometricKey).toHaveBeenCalledWith(biometricKey);
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });

    it('should throw UnauthorizedException if biometric credentials are invalid', async () => {
      const biometricKey = 'testbiometrickey';

      userService.findByBiometricKey = jest.fn().mockResolvedValue(null);

      await expect(authService.biometricLogin(biometricKey)).rejects.toThrow(UnauthorizedException);
    });
  });
});
