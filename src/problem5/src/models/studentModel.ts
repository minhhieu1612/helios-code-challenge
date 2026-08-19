import { Schema, model, Document } from 'mongoose';

export type GenderType = 'male' | 'female' | 'other';

export interface IStudent extends Document {
  name: string;
  dateOfBirth: Date;
  gender: GenderType;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender (male, female, other)',
      },
      required: [true, 'Gender is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

studentSchema.index({ name: 'text' });

export const StudentModel = model<IStudent>('Student', studentSchema);
