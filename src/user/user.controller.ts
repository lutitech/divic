
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email, password, biometricKey } = createUserDto;
    return this.userService.createUser(email, password, biometricKey ?? undefined);
  }
}
