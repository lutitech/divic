import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true, // This will automatically generate the schema
      driver: ApolloDriver, // Add the "driver" option
    }),
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
