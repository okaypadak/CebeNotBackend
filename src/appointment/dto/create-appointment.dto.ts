import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  start: string;

  @IsNumber()
  durationDays: number;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsEnum(['once', 'daily', 'weekly', 'monthly'])
  repeat: 'once' | 'daily' | 'weekly' | 'monthly';
}
