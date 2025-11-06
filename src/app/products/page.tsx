import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import connectDB from '@/lib/mongodb';
import { Category, NavbarCategory } from '@/app/models';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Product Catalog - Huawei eKit UAE',
  description: 'Browse Huawei eKit UAE comprehensive product catalog. Discover networking solutions, enterprise technology, and IT infrastructure products tailored for UAE businesses.',
  keywords: 'Huawei products, IT products UAE, networking solutions, enterprise technology, product catalog, Huawei eKit UAE, business technology',
  openGraph: {
    title: 'Product Catalog - Huawei eKit UAE',
    description: 'Browse Huawei eKit UAE comprehensive product catalog. Discover networking solutions, enterprise technology, and IT infrastructure products tailored for UAE businesses.',
    type: 'website',
    url: 'https://huawei-uae.com/products',
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function fetchCategories() {
  try {
    // Direct database connection instead of API call
    await connectDB();
    
    const categories = await Category.find({ isActive: true })
      .populate({
        path: 'navbarCategory',
        match: { isActive: true },
        select: 'name slug description order'
      })
      .select('name slug description image navbarCategory order')
      .sort({ order: 1, createdAt: -1 });

    // Filter out categories where navbar category is null (inactive navbar categories)
    const filteredCategories = categories.filter(category => category.navbarCategory);

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(filteredCategories))
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, data: null };
  }
}

export default async function ProductsPage() {
  const categoriesData = await fetchCategories();
  
  return <ProductsClient initialData={categoriesData} />;
}