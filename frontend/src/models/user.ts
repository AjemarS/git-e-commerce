import { IProduct } from "./product";

export interface IUser {
  id: number;
  email: string;
  password: string;
  cart: IProduct[];
}
