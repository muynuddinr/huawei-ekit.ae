import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { Product, NavbarCategory, Category, SubCategory } from '@/app/models';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

// Use dynamic rendering but generate static params for known routes
export const dynamic = 'force-dynamic';
export const dynamicParams = true; // Allow dynamic params that weren't pre-generated
export const revalidate = 0;

interface PageProps {
  params: {
    categorySlug: string;   // category slug
    subCategorySlug: string; // subcategory slug
    productSlug: string;    // product slug
  };
}

async function getProductWithHierarchy(categorySlug: string, subCategorySlug: string, productSlug: string) {
  try {
    await connectDB();

    const product = await Product.findOne({
      slug: productSlug,
      isActive: true
    })
      .populate({
        path: 'navbarCategory',
        select: 'name slug'
      })
      .populate({
        path: 'category',
        select: 'name slug'
      })
      .populate({
        path: 'subcategory',
        populate: {
          path: 'category',
          populate: {
            path: 'navbarCategory',
            select: 'name slug'
          }
        }
      });

    // Verify the product belongs to the correct hierarchy
    if (!product ||
      !product.category ||
      !product.subcategory ||
      (product.category as any).slug !== categorySlug ||
      (product.subcategory as any).slug !== subCategorySlug) {
      return null;
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductWithHierarchy(
    resolvedParams.categorySlug,
    resolvedParams.subCategorySlug,
    resolvedParams.productSlug
  );

  if (!product) {
    notFound();
  }

  // Serialize the product data for the client component
  const productData = {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    keyFeatures: product.keyFeatures,
    image1: product.image1,
    image2: product.image2 ?? undefined,
    image3: product.image3 ?? undefined,
    image4: product.image4 ?? undefined,
    navbarCategory: {
      name: (product.navbarCategory as any).name,
      slug: (product.navbarCategory as any).slug
    },
    category: {
      name: (product.category as any).name,
      slug: (product.category as any).slug
    },
    subcategory: {
      name: (product.subcategory as any).name,
      slug: (product.subcategory as any).slug
    }
  };

  return <ProductDetailClient product={productData} />;
}

// Generate static params for all active products
export async function generateStaticParams() {
  try {
    await connectDB();

    // Get all active products with their relationships populated
    const products = await Product.find({ isActive: true })
      .populate({
        path: 'category',
        match: { isActive: true },
        select: 'slug'
      })
      .populate({
        path: 'subcategory',
        match: { isActive: true },
        select: 'slug'
      });

    // Filter out products where category or subcategory is null (inactive)
    const validProducts = products.filter(p => p.category && p.subcategory);

    return validProducts.map((product) => ({
      categorySlug: (product.category as any).slug,
      subCategorySlug: (product.subcategory as any).slug,
      productSlug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for products:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductWithHierarchy(
    resolvedParams.categorySlug,
    resolvedParams.subCategorySlug,
    resolvedParams.productSlug
  );

  if (!product) {
    return {
      title: 'Product Not Found - Huawei eKit UAE',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      }
    };
  }

  const navbarCategory = (product.navbarCategory as any);
  const category = (product.category as any);
  const subcategory = (product.subcategory as any);

  const title = `${product.name} Network Product - ${subcategory.name} - ${category.name} - Huawei eKit UAE`;

  const description = product.description ||
    `Discover ${product.name}, a premium network product from Huawei eKit UAE. Part of our ${subcategory.name} lineup within ${category.name}, Huawei,Huawei ekit UAE,Ekit,Huawei,delivering reliable IT solutions for UAE businesses.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${subcategory.name}, ${category.name}, ${navbarCategory.name}, Huawei products, IT solutions UAE, networking solutions, enterprise technology,, Huawei eKit UAE`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://huawei-uae.com/products/${resolvedParams.categorySlug}/${resolvedParams.subCategorySlug}/${resolvedParams.productSlug}`,
      images: product.image1 ? [{ url: product.image1 }] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
