import mongoose, { Schema } from 'mongoose';

// Drop existing model if it exists to ensure schema changes take effect
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  navbarCategory: {
    type: Schema.Types.ObjectId,
    ref: 'NavbarCategory',
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.index({ name: 1, navbarCategory: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category; 
