export interface ProductTranslation {
  language_id: number;
  name: string;
  slug: string;
  description: string;
  ingredient: string;
  nutrition_info: string;
  usage_instruction: string;
  reason_to_choose: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: number;
  is_active: boolean;
  price: number;
  compare_at_price: string;
  stock_quantity: number;
  shipping_from: string;
  category_id: number;

  product_translations: ProductTranslation[];
  product_images: ProductImage[];
}

export interface ProductDetail {
  id?: number;
  price: number;
  compare_at_price: number;
  stock_quantity: number;
  origin: string;
  quantity_per_pack: number;
  shipping_from: string;
  category_id: number;
  type: 'domestic' | 'export';

  product_translations: ProductTranslation[];
  product_images: ProductImage[];

}
