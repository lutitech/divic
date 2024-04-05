
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // Ensure UserService is imported and injected
    private jwtService: JwtService,
  ) {}


  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async biometricLogin(biometricKey: string): Promise<string> {
    
    const user = await this.userService.findByBiometricKey(biometricKey);
    if (!user) {
      throw new UnauthorizedException('Invalid biometric credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
