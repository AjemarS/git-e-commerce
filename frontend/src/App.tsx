import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./pages/MainPage/MainPage";
import CartPage from "./pages/CartPage/CartPage";
// import LikedPage from "./pages/LikedPage";
// import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import UserPage from "./pages/UserPage";
import ResetPasswordPage from "./pages/ResetPassworPage";
import Footer from "./pages/MainPage/Footer/Footer";
import { useAppDispatch } from "./hooks/redux";
import { login, logout, setUser } from "./store/reducers/UserSlice";
import axios from "./api/axios";
import { IUser } from "./models/user";
import { AxiosResponse } from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCount, setCurrentLink, setProducts } from "./store/reducers/ProductSlice";
// import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const userId = localStorage.getItem("userId");

    axios
      .get("products/")
      .then((response) => {
        dispatch(setProducts(response.data.results));
        dispatch(setCount(response.data.count));
        dispatch(setCurrentLink("products/"));
      })
      .catch((error) => console.log(error));

    if (storedAuth === "true") {
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

  return (
    <div className="App">
      <Navbar />
      <ToastContainer autoClose={1500} closeOnClick theme="dark" />
      <div className="content">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* <Route path="/liked" element={<LikedPage />} /> */}
          {/* <Route path="/products/:id" element={<ProductPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/password_reset" element={<ResetPasswordPage />} />
          {/* <Route path="/password_reset/confirm" element={<ResetPasswordConfirmPage />} /> */}
          {/* <Route path="/user" element={<UserPage />} /> */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
