import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user using email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns A JWT token upon successful authentication.
   * @throws UnauthorizedException if the email or password is invalid.
   */
  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  /**
   * Authenticates a user using biometric credentials.
   * @param biometricKey - The user's biometric key.
   * @returns A JWT token upon successful authentication.
   * @throws UnauthorizedException if the biometric credentials are invalid.
   */
  async biometricLogin(biometricKey: string): Promise<string> {
    try {
      const user = await this.userService.findByBiometricKey(biometricKey);
      if (!user) {
        throw new UnauthorizedException('Invalid biometric credentials');
      }

      const payload = { email: user.email, sub: user.id };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new UnauthorizedException('Biometric login failed');
    }
  }
}
