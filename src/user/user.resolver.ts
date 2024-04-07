import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, NotFoundException} from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Mutation to create a new user
  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    const { email } = input;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    return this.userService.createUser(input);
  }

  // Query to find a user by their email
  @Query(() => User, { nullable: true })
  async findUserByEmail(@Args('email') email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}