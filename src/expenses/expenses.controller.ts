import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
  Query,
  UseGuards,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ResponseExpenseDto } from './dto/response-expense.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('expenses')
@UseGuards(RolesGuard)
@Roles('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(@Body() dto: CreateExpenseDto, @Req() req): Promise<ResponseExpenseDto> {
    const saved = await this.expensesService.create(req.user.id, dto);
    return plainToInstance(ResponseExpenseDto, saved, { excludeExtraneousValues: true });
  }

  @Get()
  async getExpenses(@Query('period') period: string, @Req() req): Promise<ResponseExpenseDto[]> {
    const list = await this.expensesService.findAll(req.user.id, period);
    return plainToInstance(ResponseExpenseDto, list, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteExpense(@Param('id') id: string, @Req() req): Promise<void> {
    await this.expensesService.delete(req.user.id, id);
  }
}
