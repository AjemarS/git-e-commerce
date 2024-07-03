import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICartItem } from "../../models/cart";

interface CartState {
  cart: {
    products: ICartItem[];
    total_price: number;
  };
  isHoveredCartBox: boolean;
  isProductBuyed: number;
}

const initialState: CartState = {
  cart: {
    products: [],
    total_price: 0,
  },
  isHoveredCartBox: false,
  isProductBuyed: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<typeof state.cart>) => {
      state.cart = action.payload;
    },
    addCartItem: (state, action: PayloadAction<ICartItem>) => {
      const existingProduct = state.cart.products.find(
        (product) => product.id === action.payload.id
      );

      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.cart.products.push(action.payload);
      }

      state.cart.total_price += Number(action.payload.price * action.payload.quantity);
    },
    removeCartItem: (state, action: PayloadAction<number>) => {
      const existingProductIndex = state.cart.products.findIndex(
        (product) => product.id === action.payload
      );

      if (existingProductIndex !== -1) {
        const existingProduct = state.cart.products[existingProductIndex];

        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
        } else {
          state.cart.products.splice(existingProductIndex, 1);
        }

        state.cart.total_price -= Number(existingProduct.price);
      }
    },
    addQuantity: (state, action: PayloadAction<number>) => {
      const existingProductIndex = state.cart.products.findIndex(
        (product) => product.id === action.payload
      );

      if (existingProductIndex !== -1) {
        const existingProduct = state.cart.products[existingProductIndex];

        existingProduct.quantity++;

        state.cart.total_price += Number(existingProduct.price);
      }
    },
    subtractQuantity: (state, action: PayloadAction<number>) => {
      const existingProductIndex = state.cart.products.findIndex(
        (product) => product.id === action.payload
      );

      if (existingProductIndex !== -1) {
        const existingProduct = state.cart.products[existingProductIndex];

        existingProduct.quantity--;

        if (existingProduct.quantity <= 0) {
          cartSlice.caseReducers.removeCartItem(state, {
            payload: action.payload,
            type: action.type,
          });
        } else {
          state.cart.total_price -= Number(existingProduct.price);
        }
      }
    },
    setIsHoveredCartBox: (state, action: PayloadAction<boolean>) => {
      state.isHoveredCartBox = action.payload;
    },
  },
});

export const {
  setCart,
  addCartItem,
  removeCartItem,
  addQuantity,
  subtractQuantity,
  setIsHoveredCartBox,
} = cartSlice.actions;

export default cartSlice.reducer;
