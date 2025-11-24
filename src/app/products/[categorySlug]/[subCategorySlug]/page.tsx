import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { SubCategory, Product, NavbarCategory, Category } from '@/app/models';
import SubCategoryProductsClient from './SubCategoryProductsClient';
import { Metadata } from 'next';

// Use dynamic rendering but generate static params for known routes
export const dynamic = 'force-dynamic';
export const dynamicParams = true; // Allow dynamic params that weren't pre-generated
export const revalidate = 0;

interface PageProps {
  params: {
    categorySlug: string;   // category slug
    subCategorySlug: string; // subcategory slug
  };
}

async function getSubCategoryWithProducts(categorySlug: string, subCategorySlug: string) {
  try {
    await connectDB();

    const subcategory = await SubCategory.findOne({
      slug: subCategorySlug,
      isActive: true
    }).populate({
      path: 'category',
      populate: {
        path: 'navbarCategory',
        select: 'name slug'
      }
    });

    // Verify the subcategory belongs to the correct category
    if (!subcategory ||
      !subcategory.category ||
      (subcategory.category as any).slug !== categorySlug) {
      return null;
    }

    // Get all products under this subcategory
    const products = await Product.find({
      subcategory: subcategory._id,
      isActive: true
    })
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 });

    return {
      subcategory: JSON.parse(JSON.stringify(subcategory)),
      products: JSON.parse(JSON.stringify(products))
    };
  } catch (error) {
    console.error('Error fetching subcategory with products:', error);
    return null;
  }
}

export default async function SubCategoryProductsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getSubCategoryWithProducts(resolvedParams.categorySlug, resolvedParams.subCategorySlug);

  if (!data) {
    notFound();
  }

  return <SubCategoryProductsClient data={data} />;
}

// Generate static params for all active subcategories
export async function generateStaticParams() {
  try {
    await connectDB();

    // Get all active subcategories with their category populated
    const subcategories = await SubCategory.find({ isActive: true })
      .populate({
        path: 'category',
        match: { isActive: true },
        select: 'slug'
      });

    // Filter out subcategories where category is null (inactive categories)
    const validSubcategories = subcategories.filter(sub => sub.category);

    return validSubcategories.map((subcategory) => ({
      categorySlug: (subcategory.category as any).slug,
      subCategorySlug: subcategory.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for subcategories:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getSubCategoryWithProducts(resolvedParams.categorySlug, resolvedParams.subCategorySlug);

  if (!data) {
    return {
      title: 'Products Not Found - Huawei eKit UAE',
      description: 'The requested product subcategory could not be found.',
      robots: {
        index: false,
        follow: false,
      }
    };
  }

  const { subcategory } = data;
  const category = subcategory.category as any;
  const navbarCategory = category.navbarCategory;

  const title = `${subcategory.name} Network Products - ${category.name} - ${navbarCategory.name} - Huawei eKit UAE`;

  const description = subcategory.description ||
    `Explore ${subcategory.name} network products under ${category.name} in ${navbarCategory.name} at Huawei eKit UAE. Find comprehensive IT solutions and technology products tailored for UAE businesses.`;

  return {
    title,
    description,
    keywords: `${subcategory.name}, ${category.name}, ${navbarCategory.name},Huawei ekit UAE,Ekit,Huawei, Huawei products, IT solutions UAE, networking solutions, enterprise technology, Huawei eKit UAE`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://huawei-uae.com/products/${resolvedParams.categorySlug}/${resolvedParams.subCategorySlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
