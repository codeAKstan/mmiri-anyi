import mongoose from 'mongoose';

const stewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  employeeId: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Water Quality', 'Distribution', 'Customer Service', 'Maintenance', 'Field Operations'],
    default: 'Field Operations'
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  dateHired: {
    type: Date,
    required: [true, 'Date hired is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  permissions: {
    canViewReports: {
      type: Boolean,
      default: true
    },
    canCreateReports: {
      type: Boolean,
      default: true
    },
    canUpdateReports: {
      type: Boolean,
      default: false
    },
    canDeleteReports: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
stewardSchema.index({ department: 1 });
stewardSchema.index({ status: 1 });
stewardSchema.index({ createdAt: -1 });

// Pre-save middleware to generate employee ID if not provided
stewardSchema.pre('save', async function(next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Steward').countDocuments();
    this.employeeId = `STW${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Instance method to get full name and employee info
stewardSchema.methods.getDisplayInfo = function() {
  return {
    fullName: this.name,
    employeeId: this.employeeId,
    department: this.department,
    position: this.position,
    status: this.status
  };
};

// Static method to find active stewards
stewardSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

// Static method to find stewards by department
stewardSchema.statics.findByDepartment = function(department) {
  return this.find({ department, status: 'Active' });
};

const Steward = mongoose.models.Steward || mongoose.model('Steward', stewardSchema);

export default Steward;