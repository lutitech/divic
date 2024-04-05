
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import {AuthController} from './auth.controller'
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
  }),
    UserModule
  ],
  providers: [AuthService, UserService, PrismaService, AuthResolver],
  controllers: [AuthController],
})
export class AuthModule {}
