import { Expose, Transform } from 'class-transformer';

export class ResponseAppointmentEventDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  id?: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  appointmentId: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  userId: string;

  @Expose() date: Date;
  @Expose() explanation: string;
}
