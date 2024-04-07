import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user using email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A JWT token if authentication is successful.
   * @throws UnauthorizedException if authentication fails.
   */
  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    try {
      return await this.authService.login(email, password);
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  /**
   * Authenticates a user using biometric key.
   * @param biometricKey - The biometric key of the user.
   * @returns A JWT token if authentication is successful.
   * @throws UnauthorizedException if authentication fails.
   */
  @Mutation(() => String)
  async biometricLogin(@Args('biometricKey') biometricKey: string): Promise<string> {
    try {
      return await this.authService.biometricLogin(biometricKey);
    } catch (error) {
      throw new UnauthorizedException('Invalid biometric credentials');
    }
  }
}