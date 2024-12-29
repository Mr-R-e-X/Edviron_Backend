import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true, enum: ['Success', 'Pending', 'Failed'] })
  status: string;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ required: true })
  gateway: string;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop()
  bank_refrence: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Student' })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
