import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class School extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [Types.ObjectId], ref: 'Student', default: [] })
  students: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'School_Admin', default: [] })
  admins: Types.ObjectId[];
}

export const SchoolSchema = SchemaFactory.createForClass(School);
