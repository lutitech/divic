import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserService, UserResolver, PrismaService],
  exports:[UserService] // Exports the UserService for dependency injection
})
export class UserModule {}