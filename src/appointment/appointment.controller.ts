import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
@UseInterceptors(ClassSerializerInterceptor)
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get()
  async list(@Query('userId') userId: string) {
    return this.service.listAllAppointments(userId);
  }

  @Get('/events')
  async listEvents() {
    return this.service.listAllEvents();
  }
}
