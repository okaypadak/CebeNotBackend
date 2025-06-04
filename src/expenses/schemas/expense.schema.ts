import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema()
export class Expense {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop()
  note: string;

  @Prop()
  category: string;

  @Prop()
  period: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
