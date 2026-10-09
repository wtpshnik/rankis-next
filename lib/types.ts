export type Category = { slug: string; name: string; parent: string | null };

export type Product = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  images: string[];
  description: string;
  specs: { name: string; value: string }[];
  categoryPath: string[]; // full category slugs, root → leaf
};
