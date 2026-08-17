import mongoose, { Document, Schema } from 'mongoose';

export interface IEmail extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyPrice?: string;
  propertyType?: string;
  propertyLocation?: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const emailSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  propertyId: {
    type: String,
    required: false
  },
  propertyPrice: {
    type: String,
    required: false
  },
  propertyType: {
    type: String,
    required: false
  },
  propertyLocation: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model<IEmail>('Email', emailSchema);