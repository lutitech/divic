import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => String) // Specify the return type of the query
  sayHello(): string {
    return 'Hello';
  }

  @Mutation(returns => User)
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    const { email, password, biometricKey } = input;
    return this.userService.createUser(email, password, biometricKey);
  }
}

