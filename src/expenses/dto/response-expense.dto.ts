import { Expose } from 'class-transformer';

export class ResponseExpenseDto {
  @Expose() id: string;

  @Expose() amount: number;

  @Expose() note: string;

  @Expose() category: string;

  @Expose() period: string;

  @Expose() date: Date;
}
