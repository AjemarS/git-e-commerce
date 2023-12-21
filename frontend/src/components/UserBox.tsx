import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Logout from "./Logout";
import { logout } from "../store/reducers/UserSlice";
import axios from "../api/axios";
import { toast } from "react-toastify";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

type Props = {};

const UserBox = (props: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    try {
      axios.post(
        "logout/",
        {
          refresh: localStorage.getItem("refreshToken"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      axios.defaults.headers.common["Authorization"] = null;

      toast.success("Logout succesfully!");

      dispatch(logout());
    } catch (e: any) {
      toast.error(e.message);
      console.log(e);
    }
  };

  return (
    <div
      className="navbar__item__btns--user"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Link to={"/user"}>
        <AccountBoxIcon fontSize="large" />
      </Link>
      {isHovered && (
        <div
          className="navbar__item__popups userBox"
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
          <div>{user.email}</div>
          <Link to={"/user"}>User</Link>
          <Logout onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default UserBox;
