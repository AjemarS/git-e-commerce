import { useEffect } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar/Navbar";
import MainPage from "./pages/MainPage/MainPage";
import CartPage from "./pages/CartPage/CartPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ResetPasswordPage from "./pages/ResetPassworPage";
import Footer from "./pages/Footer/Footer";
import { useAppDispatch } from "./hooks/redux";
import { login, logout, setUser } from "./store/reducers/UserSlice";
import axios from "./api/axios";
import { IUser } from "./models/user";
import { AxiosResponse } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCount, setCurrentLink, setProducts } from "./store/reducers/ProductSlice";
import { jwtDecode } from "jwt-decode";
import useApiProducts from "./hooks/useApiProducts";
import useApiFilters from "./hooks/useApiFilters";
import { setCategories, setManufacturers, setPriceRange } from "./store/reducers/FilterSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Перевіряємо чи залогінений користувач (не вийшов час токену), якщо так, то логінимо, інакше логаутимо
    const storedAuth = localStorage.getItem("isAuthenticated");
    const userId = localStorage.getItem("userId");

    if (storedAuth === "true" && userId) {
      dispatch(login());
      axios
        .get<IUser>(`users/public/${userId}`)
        .then((response: AxiosResponse<IUser>) => {
          dispatch(setUser(response.data));
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      dispatch(logout());
    }

    // Перевіряємо чи не закінчився час в refresh токені, якщо так, то відправляємо токен на оновлення
    const token = localStorage.getItem("refreshToken");
    const decodedToken = token && jwtDecode(token);

    if (decodedToken && decodedToken.exp! - Date.now() / 1000 < 60) {
      axios
        .post(
          "token/refresh/",
          {
            refresh: token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          localStorage.setItem("accessToken", response.data.access);
        })
        .catch((error) => {
          console.error("Помилка оновлення токену:", error);
        });
    }
  }, [dispatch]);

  // Отримуємо список продуктів при вході на головну сторінку
  const products = useApiProducts("products/");

  if (products.error) {
    toast.error(products.error.message);
  } else if (products.data && !products.isLoading) {
    dispatch(setProducts(products.data.results));
    dispatch(setCount(products.data.count));
    dispatch(setCurrentLink("products/"));
  }

  // Отримуємо фільтри продуктів при вході на головну сторінку
  const filters = useApiFilters("products-data/filters/");

  if (filters.error) {
    toast.error(filters.error.message);
  } else if (filters.data && !filters.isLoading) {
    dispatch(setCategories(filters.data.categories));
    dispatch(setManufacturers(filters.data.manufacturers));
    dispatch(
      setPriceRange({
        minPrice: filters.data.priceRange.minRange,
        maxPrice: filters.data.priceRange.maxRange,
      })
    );
  }

  return (
    <div className="App">
      <Navbar />
      <ToastContainer autoClose={1500} closeOnClick theme="dark" />
      <div className="content">
        <Routes>
          <Route path="/home" element={<MainPage />} />
          <Route path="/home/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/password_reset" element={<ResetPasswordPage />} />

          <Route path="*" element={<Navigate to={"/home"} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
