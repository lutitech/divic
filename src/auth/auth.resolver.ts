import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.authService.login(email, password);
  }

  @Mutation(returns => String)
  async biometricLogin(@Args('biometricKey') biometricKey: string): Promise<string> {
    return this.authService.biometricLogin(biometricKey);
  }
}
