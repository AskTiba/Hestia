import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (Owner)' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT token' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}
