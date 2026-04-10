import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientId: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true
    },
    doctor: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
