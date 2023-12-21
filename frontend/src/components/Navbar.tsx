import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import SearchBar from "./SearchBar";
import { useAppSelector } from "../hooks/redux";
import UserBox from "./UserBox";
import CartBox from "./CartBox";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const Navbar = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <header>
      <nav className="navbar__layout">
        <div className="navbar__item--logo">
          <Link to={"/"}>
            <span>Shop</span>
          </Link>
        </div>

        <div className="navbar__item--search">
          <SearchBar />
        </div>

        <div className="navbar__item--btns">

          {isAuthenticated ? (
            <CartBox />
          ) : (
            <Link to={"/login"}>
              <ShoppingCartOutlinedIcon fontSize="large" />
            </Link>
          )}

          {isAuthenticated ? (
            <UserBox />
          ) : (
            <Link to={"/login"}>
              <button className="navbar__item--login-btn">Login</button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
