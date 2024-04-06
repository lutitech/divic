
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserService, UserResolver, PrismaService],
  // controllers:[UserController]
})
export class UserModule {}
