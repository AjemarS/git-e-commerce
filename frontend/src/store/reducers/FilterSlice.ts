import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  categories: string[];
  manufacturers: string[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
}

const initialState: ProductState = {
  categories: [],
  manufacturers: [],
  priceRange: {
    minPrice: 0,
    maxPrice: 100000,
  },
};

export const FilterSlice = createSlice({
  name: "Filter",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setManufacturers: (state, action: PayloadAction<string[]>) => {
      state.manufacturers = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ minPrice: number; maxPrice: number }>) => {
      state.priceRange = action.payload;
    },
  },
});

export const { setCategories, setManufacturers, setPriceRange } = FilterSlice.actions;
export default FilterSlice.reducer;
