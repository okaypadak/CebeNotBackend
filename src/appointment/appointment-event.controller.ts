import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ResponseAppointmentEventDto } from './dto/response-appointment-event.dto';

@Controller('appointment-events')
@UseInterceptors(ClassSerializerInterceptor)
export class AppointmentEventController {
  constructor(private readonly service: AppointmentService) {}

  @Get()
  async list(): Promise<ResponseAppointmentEventDto[]> {
    return this.service.listAllEvents();
  }
}
