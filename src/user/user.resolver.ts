import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns The user if found, otherwise null.
   * @throws NotFoundException if the user is not found.
   */
  @Query(() => User, { nullable: true })
  async findUserByEmail(@Args('email') email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Creates a new user.
   * @param input - The data to create the user.
   * @returns The created user.
   * @throws ConflictException if a user with the same email already exists.
   */
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    const { email } = input;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    return this.userService.createUser(input);
  }
}
