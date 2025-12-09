import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import { Product, Category, SubCategory, NavbarCategory } from '@/app/models';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://huawei-uae.com';

  try {
    await connectDB();

    const [products, categories, subcategories, navbarCategories] = await Promise.all([
      Product.find({ isActive: true })
        .populate('category', 'slug')
        .populate('subcategory', 'slug'),
      Category.find({ isActive: true })
        .populate('navbarCategory', 'slug'),
      SubCategory.find({ isActive: true })
        .populate('category', 'slug'),
      NavbarCategory.find({ isActive: true }),
    ]);

    // ===== Static Routes =====
    const staticRoutes: MetadataRoute.Sitemap = [
      '',
      '/about',
      '/contact',
      '/products',
      '/solution',
      '/privacy-policy',
      '/terms-of-service',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }));

    // ===== NavbarCategory Routes: /products/:navbarCategorySlug =====
    const navbarCategoryRoutes: MetadataRoute.Sitemap = navbarCategories
      .filter(nav => nav.isActive)
      .map(nav => ({
        url: `${baseUrl}/products/${nav.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));

    // ===== Category Routes: /products/:categorySlug =====
    const categoryRoutes: MetadataRoute.Sitemap = categories
      .map(category => {
        const navbarCategory = (category.navbarCategory as any);
        if (!navbarCategory) return null;

        return {
          url: `${baseUrl}/products/${category.slug}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    // ===== SubCategory Routes: /products/:categorySlug/:subCategorySlug =====
    const subcategoryRoutes: MetadataRoute.Sitemap = subcategories
      .map(subcategory => {
        const category = (subcategory.category as any);
        if (!category) return null;

        return {
          url: `${baseUrl}/products/${category.slug}/${subcategory.slug}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    // ===== Product Routes: /products/:categorySlug/:subCategorySlug/:productSlug =====
    const productRoutes: MetadataRoute.Sitemap = products
      .map(product => {
        const subcategory = (product.subcategory as any);
        const category = (product.category as any);

        if (!subcategory || !category) return null;

        return {
          url: `${baseUrl}/products/${category.slug}/${subcategory.slug}/${product.slug}`,
          lastModified: new Date(product.updatedAt || product.createdAt).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    return [
      ...staticRoutes,
      ...navbarCategoryRoutes,
      ...categoryRoutes,
      ...subcategoryRoutes,
      ...productRoutes,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // Fallback to static sitemap if DB connection fails
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
    ];
  }
}