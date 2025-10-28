import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { RegisterUserDto, LoginUserDto } from '../dto/user.dto';
import { Reflector } from '@nestjs/core';
import { validateRouteBody } from '../../validation/validate.helper';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) { }

  @Post('register')
  @JoiSchema(registerSchema)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() body: RegisterUserDto) {
    try {
      const validated = validateRouteBody(this.reflector, (this as any).register, body);
      return this.authService.register(validated);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('login')
  @JoiSchema(loginSchema)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(@Body() body: LoginUserDto) {
    try {
      const validated = validateRouteBody(this.reflector, (this as any).login, body);
      const user = await this.authService.validateUser(validated.email, validated.password);
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      return this.authService.login(user);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}