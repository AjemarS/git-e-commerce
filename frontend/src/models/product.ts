export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image: string;
}

export interface ProductProps {
  product: IProduct;
}
