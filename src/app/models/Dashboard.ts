import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for dashboard statistics
export interface IDashboard extends Document {
  // Overview metrics
  totalContacts: number;
  totalProducts: number;
  totalCategories: number;
  totalSubcategories: number;
  
  // Contact specific metrics
  newContacts: number;
  repliedContacts: number;
  inProgressContacts: number;
  closedContacts: number;
  unreadContacts: number;
  highPriorityContacts: number;
  
  // Growth metrics (percentages)
  contactsGrowth: number;
  productsGrowth: number;
  categoriesGrowth: number;
  
  // Service distribution
  serviceDistribution: Array<{
    serviceName: string;
    count: number;
    percentage: number;
  }>;
  
  // Trend data (last 7 days)
  contactsTrend: Array<{
    date: Date;
    count: number;
  }>;
  
  productsTrend: Array<{
    date: Date;
    count: number;
  }>;
  
  // Product category breakdown
  productsByCategory: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  
  // Category breakdown
  categoriesBreakdown: Array<{
    name: string;
    subcategoriesCount: number;
  }>;
  
  // Performance metrics
  avgResponseTime: number; // in hours
  completionRate: number; // percentage of closed vs total contacts
  
  // System metrics
  totalViews: number;
  activeUsers: number;
  
  // Revenue data (if applicable)
  revenue: {
    monthly: number;
    growth: number;
    currency: string;
  };
  
  // Metadata
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  type: 'daily' | 'weekly' | 'monthly' | 'real-time';
  createdBy: string; // admin user who generated the report
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const DashboardSchema: Schema = new Schema({
  // Overview metrics
  totalContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  totalProducts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  totalCategories: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  totalSubcategories: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  
  // Contact specific metrics
  newContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  repliedContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  inProgressContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  closedContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  unreadContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  highPriorityContacts: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  
  // Growth metrics
  contactsGrowth: { 
    type: Number, 
    required: true, 
    default: 0,
    min: -100,
    max: 1000
  },
  productsGrowth: { 
    type: Number, 
    required: true, 
    default: 0,
    min: -100,
    max: 1000
  },
  categoriesGrowth: { 
    type: Number, 
    required: true, 
    default: 0,
    min: -100,
    max: 1000
  },
  
  // Service distribution
  serviceDistribution: [{
    serviceName: { 
      type: String, 
      required: true,
      trim: true
    },
    count: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    percentage: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    }
  }],
  
  // Trend data
  contactsTrend: [{
    date: { 
      type: Date, 
      required: true 
    },
    count: { 
      type: Number, 
      required: true, 
      min: 0 
    }
  }],
  
  productsTrend: [{
    date: { 
      type: Date, 
      required: true 
    },
    count: { 
      type: Number, 
      required: true, 
      min: 0 
    }
  }],
  
  // Product category breakdown
  productsByCategory: [{
    category: { 
      type: String, 
      required: true,
      trim: true
    },
    count: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    percentage: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    }
  }],
  
  // Category breakdown
  categoriesBreakdown: [{
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    subcategoriesCount: { 
      type: Number, 
      required: true, 
      min: 0 
    }
  }],
  
  // Performance metrics
  avgResponseTime: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  completionRate: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0,
    max: 100
  },
  
  // System metrics
  totalViews: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  activeUsers: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  
  // Revenue data
  revenue: {
    monthly: { 
      type: Number, 
      required: true, 
      default: 0,
      min: 0
    },
    growth: { 
      type: Number, 
      required: true, 
      default: 0,
      min: -100
    },
    currency: { 
      type: String, 
      required: true, 
      default: 'USD',
      uppercase: true,
      minlength: 3,
      maxlength: 3
    }
  },
  
  // Metadata
  generatedAt: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  periodStart: { 
    type: Date, 
    required: true 
  },
  periodEnd: { 
    type: Date, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'real-time'],
    default: 'real-time'
  },
  createdBy: { 
    type: String, 
    required: true,
    trim: true,
    default: 'system'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'dashboards'
});

// Indexes for better query performance
DashboardSchema.index({ generatedAt: -1 });
DashboardSchema.index({ type: 1, generatedAt: -1 });
DashboardSchema.index({ periodStart: 1, periodEnd: 1 });
DashboardSchema.index({ createdBy: 1 });

// Pre-save middleware to calculate completion rate
DashboardSchema.pre('save', function(next) {
  const dashboard = this as unknown as IDashboard;
  
  // Calculate completion rate
  if (dashboard.totalContacts > 0) {
    dashboard.completionRate = Math.round((dashboard.closedContacts / dashboard.totalContacts) * 100);
  }
  
  // Calculate average response time (mock calculation - you can implement real logic)
  dashboard.avgResponseTime = dashboard.totalContacts > 0 ? 
    Math.round((dashboard.repliedContacts / dashboard.totalContacts) * 24) : 0;
  
  next();
});

// Instance method to export as JSON
DashboardSchema.methods.exportData = function() {
  const dashboard = this.toObject();
  delete dashboard._id;
  delete dashboard.__v;
  return dashboard;
};

// Virtual for dashboard summary
DashboardSchema.virtual('summary').get(function(this: IDashboard) {
  return {
    totalItems: this.totalContacts + this.totalProducts + this.totalCategories,
    activeContacts: this.newContacts + this.inProgressContacts,
    responseRate: this.totalContacts > 0 ? Math.round((this.repliedContacts / this.totalContacts) * 100) : 0,
    priority: {
      high: this.highPriorityContacts,
      percentage: this.totalContacts > 0 ? Math.round((this.highPriorityContacts / this.totalContacts) * 100) : 0
    }
  };
});

const Dashboard = mongoose.models.Dashboard || mongoose.model<IDashboard>('Dashboard', DashboardSchema);

// Add the static method after model creation
(Dashboard as any).createSnapshot = async function(data: any, type: string = 'real-time') {
  const periodStart = new Date();
  periodStart.setHours(0, 0, 0, 0);
  
  const periodEnd = new Date();
  periodEnd.setHours(23, 59, 59, 999);
  
  return this.create({
    ...data,
    type,
    periodStart,
    periodEnd,
    generatedAt: new Date()
  });
};

export default Dashboard;
