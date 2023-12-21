import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import productReducer from "./reducers/ProductSlice";
import userReducer from "./reducers/UserSlice";
import cartReducer from "./reducers/CartSlice";

const rootReducer = combineReducers({
  product: productReducer,
  auth: userReducer,
  cart: cartReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
