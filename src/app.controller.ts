import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminOnly(@Req() req): string {
    return `Hoş geldin admin: ${req.user.id}`;
  }
}
