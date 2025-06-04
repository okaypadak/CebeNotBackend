export class CreateExpenseDto {
  amount: number;
  note?: string;
  category?: string;
  period?: string;
  date?: Date;
}
