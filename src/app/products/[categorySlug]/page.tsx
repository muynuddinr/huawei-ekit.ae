import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { Category, SubCategory, NavbarCategory } from '@/app/models';
import CategorySubCategoriesClient from './CategorySubCategoriesClient';
import { Metadata } from 'next';

// Use dynamic rendering but generate static params for known routes
export const dynamic = 'force-dynamic';
export const dynamicParams = true; // Allow dynamic params that weren't pre-generated
export const revalidate = 0;

interface PageProps {
  params: {
    categorySlug: string; // category slug
  };
}

async function getCategoryWithSubCategories(categorySlug: string) {
  try {
    await connectDB();

    const category = await Category.findOne({
      slug: categorySlug,
      isActive: true
    }).populate('navbarCategory', 'name slug description');

    if (!category) {
      return null;
    }

    // Get all subcategories under this category
    const subcategories = await SubCategory.find({
      category: category._id,
      isActive: true
    }).sort({ createdAt: -1 });

    return {
      category: JSON.parse(JSON.stringify(category)),
      subcategories: JSON.parse(JSON.stringify(subcategories))
    };
  } catch (error) {
    console.error('Error fetching category with subcategories:', error);
    return null;
  }
}

export default async function CategorySubCategoriesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getCategoryWithSubCategories(resolvedParams.categorySlug);

  if (!data) {
    notFound();
  }

  return <CategorySubCategoriesClient data={data} />;
}

// Generate static params for all active categories
export async function generateStaticParams() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).select('slug');

    return categories.map((category) => ({
      categorySlug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getCategoryWithSubCategories(resolvedParams.categorySlug);

  if (!data) {
    return {
      title: 'Category Not Found - Huawei eKit UAE',
      description: 'The requested product category could not be found.',
      robots: {
        index: false,
        follow: false,
      }
    };
  }

  const { category } = data;
  const navbarCategory = (category.navbarCategory as any);
  const title = `${category.name} Network Products & Categories - ${navbarCategory.name} - Huawei eKit UAE`;

  const description = category.description ||
    `Explore ${category.name} network products and subcategories under ${navbarCategory.name} at Huawei eKit UAE. Find comprehensive IT solutions and technology products tailored for UAE businesses.`;

  return {
    title,
    description,
    keywords: `${category.name}, ${navbarCategory.name},Huawei ekit UAE,Ekit,Huawei, Huawei products, IT solutions UAE, networking solutions, enterprise technology, Huawei eKit UAE`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://huawei-uae.com/products/${resolvedParams.categorySlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
