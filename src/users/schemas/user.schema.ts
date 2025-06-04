import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'user', enum: ['user', 'admin', 'moderator'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
