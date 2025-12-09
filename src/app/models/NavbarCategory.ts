import mongoose from 'mongoose';

const navbarCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

// Create slug from name before saving
navbarCategorySchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    next();
});

const NavbarCategory = mongoose.models.NavbarCategory || mongoose.model('NavbarCategory', navbarCategorySchema);

export default NavbarCategory;
