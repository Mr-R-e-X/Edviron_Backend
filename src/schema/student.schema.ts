import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  first_name: string;

  @Prop()
  middle_name?: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ type: Types.ObjectId, ref: 'School', default: [] })
  school: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Transaction', default: [] })
  transactions: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
