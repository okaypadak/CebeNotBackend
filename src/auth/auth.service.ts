import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from '../users/schemas/user.schema';
import { plainToInstance } from 'class-transformer';
import { ResponseLoginDto } from './dto/response-login.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const user = await this.usersService.findByUsername(loginDto.username) as UserDocument;
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Şifre yanlış');

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    return plainToInstance(ResponseLoginDto, {
      message: 'Giriş başarılı',
      token
    }, { excludeExtraneousValues: true });
  }
}
