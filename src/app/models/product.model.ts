export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  currency: string;
  otherPrices?: Array<{
    currency: string;
    price: number;
  }>;
};

export type ProductInsert = Omit<Product, 'id'>;
export type ProductUpdate = Partial<Omit<Product, 'id'>> & Pick<Product, 'id'>;
