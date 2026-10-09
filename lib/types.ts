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
  extraCategories?: string[]; // additional roots (e.g. ispardavimas) the product is listed under
};

// Compact product used by cards, client-side filtering, search index and cart
export type CardProduct = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  image: string;
};
