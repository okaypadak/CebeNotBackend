// src/periods/dto/response-period.dto.ts
import { Expose } from 'class-transformer';

export class ResponsePeriodDto {
  @Expose() id: string;
  @Expose() userId: string;
  @Expose() period: string;
  @Expose() createdAt: Date;
}
