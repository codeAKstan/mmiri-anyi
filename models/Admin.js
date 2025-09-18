import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Prevent multiple admin creation by adding a pre-save hook
AdminSchema.pre('save', async function(next) {
  if (this.isNew) {
    const adminCount = await mongoose.models.Admin.countDocuments();
    if (adminCount > 0) {
      const error = new Error('Admin account already exists. Only one admin is allowed.');
      error.code = 'ADMIN_EXISTS';
      return next(error);
    }
  }
  next();
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);