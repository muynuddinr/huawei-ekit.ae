// Central export file to ensure all models are registered in the correct order
// Import in this specific order to avoid MissingSchemaError

import NavbarCategory from './NavbarCategory';
import Category from './Category';
import SubCategory from './SubCategory';
import Product from './Product';
import Contact from './Contact';
import Dashboard from './Dashboard';

// Export all models
export {
  NavbarCategory,
  Category,
  SubCategory,
  Product,
  Contact,
  Dashboard
};

// Default export for convenience
export default {
  NavbarCategory,
  Category,
  SubCategory,
  Product,
  Contact,
  Dashboard
};
