import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import connectDB from '@/lib/mongodb';
import { Category, NavbarCategory } from '@/app/models';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Product Catalog - Huawei eKit UAE | Network & IT Solutions',
  description:
    'Explore the complete Huawei eKit UAE Product Catalog, featuring network products, SME networking solutions, enterprise IT, Wi-Fi systems, switches, routers, and IT infrastructure designed for UAE businesses.',
    
  keywords:
    'Huawei network products,Huawei ekit UAE,Ekit,Huawei,, Huawei Ekit,Ekit,SME network solutions, Huawei eKit UAE, IT products UAE, networking devices, WiFi 6 UAE, switches, routers, enterprise technology, product catalog, Huawei UAE products, business IT solutions',

  openGraph: {
    title: 'Product Catalog - Huawei eKit UAE | Network & IT Solutions',
    description:
      'Browse Huawei eKit UAE’s comprehensive product catalog, including network products, Wi-Fi systems, switches, routers, SME solutions, and enterprise IT infrastructure tailored for UAE businesses.',
    type: 'website',
    url: 'https://huawei-uae.com/products',
    images: [
      {
        url: '/Huawei.png',
        width: 1200,
        height: 630,
        alt: 'Huawei eKit UAE Product Catalog',
      },
    ],
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