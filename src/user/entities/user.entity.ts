// user.entity.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field()
    id: number;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    biometricKey: string;
    
  }
  