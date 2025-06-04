import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PeriodDocument = Period & Document;

@Schema()
export class Period {
  @Prop({ required: true })
  period: string;

  @Prop({ type: [String], default: [] }) // veya: [Types.ObjectId]
  members: string[];
}

export const PeriodSchema = SchemaFactory.createForClass(Period);
