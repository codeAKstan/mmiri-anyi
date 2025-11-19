import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    default: function() {
      return 'WL' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
    }
  },
  category: {
    type: String,
    enum: ['water', 'roads', 'lighting', 'waste'],
    default: 'water'
  },
  issueType: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  ward: {
    type: String,
    trim: true,
    default: ''
  },
  landmark: {
    type: String,
    trim: true,
    default: ''
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
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
  imageUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Steward',
    default: null
  },
  notes: [{
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: String,
    imageUrl: {
      type: String,
      default: null
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
// Create indexes
reportSchema.index({ trackingNumber: 1 }, { unique: true });
reportSchema.index({ email: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;