import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  start: Date;

  @Prop({ required: true })
  durationDays: number;

  @Prop({ default: '' })
  explanation: string;

  @Prop({ enum: ['once', 'daily', 'weekly', 'monthly'], default: 'once' })
  repeat: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
