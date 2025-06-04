import {
  Controller, Get, Post, Delete, Body, Param, Req,
  UseGuards
} from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ResponsePeriodDto } from './dto/response-period.dto';
import { plainToInstance } from 'class-transformer';

@Controller('periods')
@UseGuards(RolesGuard)
@Roles('admin')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  async getPeriods(@Req() req): Promise<ResponsePeriodDto[]> {
    const userId = req.user?.id;
    if (!userId) throw new Error('userId eksik');

    const periods = await this.periodsService.findByUserId(userId);
    return plainToInstance(ResponsePeriodDto, periods, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async createPeriod(@Body() body: CreatePeriodDto, @Req() req): Promise<ResponsePeriodDto> {
    const userId = req.user?.id;
    if (!body.period || !userId) {
      throw new Error('Period ve kullanıcı zorunludur.');
    }

    const created = await this.periodsService.create(body.period, userId);
    return plainToInstance(ResponsePeriodDto, created, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async deletePeriod(@Param('id') id: string): Promise<{ message: string; id: string }> {
    const result = await this.periodsService.delete(id);
    if (!result) throw new Error('Period bulunamadı');
    return { message: 'Silindi', id };
  }
}
