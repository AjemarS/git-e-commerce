import { IProduct } from "./../../models/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  products: IProduct[];
  productsPerPage: number;
  count: number;
  currentLink: string;
}

const initialState: ProductState = {
  products: [],
  productsPerPage: 30,
  count: 0,
  currentLink: "",
};

export const ProductSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = Math.ceil(action.payload / state.productsPerPage);
    },
    setCurrentLink: (state, action: PayloadAction<string>) => {
      state.currentLink = action.payload;
    },
  },
});

export const { setProducts, setCount, setCurrentLink } = ProductSlice.actions;
export default ProductSlice.reducer;
