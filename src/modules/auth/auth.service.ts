
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: { email: string; password: string; displayName?: string }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) throw new UnauthorizedException('Email already in use');
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({ email: data.email, password: hash, displayName: data.displayName });
    return { id: user.id, email: user.email };
  }
}
