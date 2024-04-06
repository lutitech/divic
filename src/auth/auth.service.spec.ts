import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should login successfully', async () => {
    const mockUser = { 
        id: 15, 
        email: 'test@example.com', 
        password: 'password123', 
        biometricKey: 'fingerprint', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
    // Mock UserService's findByEmail method to return the mock user
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

    const token = await service.login('test@example.com', 'password123');

    expect(token).toBeDefined();
    expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@example.com', sub: mockUser.id });
  });
});
