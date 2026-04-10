import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff'],
      default: 'staff'
    },
    department: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const { passwordHash, __v, ...doc } = this.toObject({ versionKey: false });
  return doc;
};

export const User = mongoose.model('User', userSchema);
