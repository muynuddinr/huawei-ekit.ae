import mongoose, { Schema } from 'mongoose';

// Drop existing model if it exists to ensure schema changes take effect
if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}

const contactSchema = new Schema({
  fullName: {
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
  company: {
    type: String,
    required: false,
    trim: true
  },
  service: {
    type: String,
    required: true,
    enum: [
      'Network Infrastructure',
      'Wireless Solutions',
      'Security Systems',
      'Cloud Services',
      'Technical Support',
      'Partnership',
      'Other'
    ]
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'replied', 'in_progress', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    default: 'Website Form'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ isRead: 1 });

// Pre-save middleware to update timestamps
contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact; 
