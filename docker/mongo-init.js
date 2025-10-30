// MongoDB initialization script for Docker
// This script will run when MongoDB container starts for the first time

// Switch to the Huawei-ekit database
db = db.getSiblingDB('Huawei-ekit');

// Create application user with read/write permissions
db.createUser({
  user: 'huawei_app_user',
  pwd: 'HuAwEi_App_User_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'Huawei-ekit'
    }
  ]
});

// Create collections with initial structure
db.createCollection('navbarcategories');
db.createCollection('categories');
db.createCollection('subcategories');
db.createCollection('products');
db.createCollection('contacts');
db.createCollection('dashboards');

// Insert initial navbar categories
db.navbarcategories.insertMany([
  {
    name: 'CCTV SYSTEM',
    slug: 'cctv-system',
    description: 'Comprehensive CCTV and surveillance solutions',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Network Solutions',
    slug: 'network-solutions',
    description: 'Enterprise networking and infrastructure',
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Smart Building',
    slug: 'smart-building',
    description: 'Intelligent building automation systems',
    order: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.navbarcategories.createIndex({ slug: 1 }, { unique: true });
db.navbarcategories.createIndex({ order: 1 });
db.navbarcategories.createIndex({ isActive: 1 });

db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ navbarCategory: 1 });
db.categories.createIndex({ isActive: 1 });

db.subcategories.createIndex({ slug: 1 }, { unique: true });
db.subcategories.createIndex({ category: 1 });
db.subcategories.createIndex({ navbarCategory: 1 });
db.subcategories.createIndex({ isActive: 1 });

db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ subcategory: 1 });
db.products.createIndex({ navbarCategory: 1 });
db.products.createIndex({ isActive: 1 });

db.contacts.createIndex({ email: 1 });
db.contacts.createIndex({ status: 1 });
db.contacts.createIndex({ isRead: 1 });
db.contacts.createIndex({ createdAt: -1 });

print('MongoDB initialization completed successfully for Huawei eKit UAE');