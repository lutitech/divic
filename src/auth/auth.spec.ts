
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return a token on successful login', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    jest.spyOn(authService, 'login').mockImplementation(async () => 'token');

    const result = await authController.login(credentials);
    expect(result).toEqual('token');
  });

  it('should throw an error for login with incorrect email', async () => {
    const credentials = { email: 'incorrect@example.com', password: 'password' };
    jest.spyOn(authService, 'login').mockImplementation(() => {
      throw new Error('Invalid credentials');
    });

    await expect(authController.login(credentials)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for login with incorrect password', async () => {
    const credentials = { email: 'test@example.com', password: 'wrongpassword' };
    jest.spyOn(authService, 'login').mockImplementation(() => {
      throw new Error('Invalid credentials');
    });

    await expect(authController.login(credentials)).rejects.toThrow('Invalid credentials');
  });
});