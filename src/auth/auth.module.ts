import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import ConfigModule
    JwtModule.registerAsync({ // Register JWT module asynchronously
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT_SECRET from environment variables
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    UserModule
  ],
  providers: [AuthService, UserService, PrismaService, AuthResolver],
})
export class AuthModule {}
