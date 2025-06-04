import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // 1. Authorization kontrolü
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header eksik veya hatalı');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token alınamadı');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      request.user = decoded; // decoded JWT verisi req.user içine ekleniyor
    } catch (err) {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş token');
    }

    // 2. @Roles() decorator'dan beklenen rolleri oku
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Role istenmemişse, sadece JWT yeterli
    }

    const userRole = decoded.role?.toLowerCase();
    const normalizedRequiredRoles = requiredRoles.map(r => r.toLowerCase());

    if (!userRole || !normalizedRequiredRoles.includes(userRole)) {
      throw new ForbiddenException(`Rol yetkisi yok: Gerekli → ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
