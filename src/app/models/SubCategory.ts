import mongoose, { Schema } from 'mongoose';

const subCategorySchema = new Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
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
    }
}, {
    timestamps: true
});

// Create compound index for category + slug
subCategorySchema.index({ category: 1, slug: 1 });
subCategorySchema.index({ category: 1, isActive: 1 });

// Auto-generate slug from name before saving
subCategorySchema.pre('save', function(next) {
    if (this.isModified('name') && !this.isModified('slug')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;
