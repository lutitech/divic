
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials.email, credentials.password);
  }


  @Post('biometricLogin')
  async biometricLogin(@Body() biometricKey: { biometricKey: string }) {
    return await this.authService.biometricLogin(biometricKey.biometricKey);
    
  }
}
