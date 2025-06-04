import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class AppointmentEvent extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Appointment' })
  appointmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ default: '' })
  explanation: string;
}

export const AppointmentEventSchema = SchemaFactory.createForClass(AppointmentEvent);
