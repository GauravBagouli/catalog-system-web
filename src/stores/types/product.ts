// types.ts
export interface Product {
  id: string;
  product_type_id: string;
  name: string;
  description: string;
  product_images: any[];
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductType {
  id: string;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}