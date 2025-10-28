
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;
    // load user's role name
    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id }, include: { role: true } });
    const roleName = dbUser?.role?.name;
    if (!roleName || !required.includes(roleName)) throw new ForbiddenException('Forbidden');
    return true;
  }
}
