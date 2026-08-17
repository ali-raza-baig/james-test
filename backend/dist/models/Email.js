import mongoose, { Schema } from 'mongoose';
const emailSchema = new Schema({
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
export default mongoose.model('Email', emailSchema);
