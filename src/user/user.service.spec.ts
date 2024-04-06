import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


  describe('UserResolver', () => {
    let userResolver: UserResolver;
    let userService: UserService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserResolver,
          {
            provide: UserService,
            useValue: {
              findByEmail: jest.fn(), // Correctly mock this method
              createUser: jest.fn(),
            },
          },
        ],
      }).compile();
  
      userResolver = module.get<UserResolver>(UserResolver);
      userService = module.get<UserService>(UserService);
    });



  describe('createUser', () => {
    it('should create a new user', async () => {
      const input: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'testpassword',
        biometricKey: 'testbiometrickey',
      };
      const createdUser: User = { id: 2, email: input.email, password: input.password, biometricKey: input.biometricKey };


      userService.findByEmail= jest.fn().mockResolvedValue(null);
      userService.createUser= jest.fn().mockResolvedValue(createdUser);

      const result = await userResolver.createUser(input);

      expect(result).toEqual(createdUser);
      expect(userService.findByEmail).toHaveBeenCalledWith(input.email);
      expect(userService.createUser).toHaveBeenCalledWith(input);
    });

    it('should throw ConflictException if user with the same email already exists', async () => {
      const input: CreateUserDto = {
        email: 'existinguser@example.com',
        password: 'testpassword',
        biometricKey: 'testbiometrickey',
      };

      userService.findByEmail= jest.fn().mockResolvedValue({ id: 3, ...input });

      await expect(userResolver.createUser(input)).rejects.toThrowError(ConflictException);
    });
  });

});


