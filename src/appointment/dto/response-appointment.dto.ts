// src/appointment/dto/response-appointment.dto.ts
import { Expose } from 'class-transformer';

export class ResponseAppointmentDto {
  @Expose() id: string;
  @Expose() userId: string;
  @Expose() start: Date;
  @Expose() durationDays: number;
  @Expose() explanation: string;
  @Expose() repeat: string;
}
