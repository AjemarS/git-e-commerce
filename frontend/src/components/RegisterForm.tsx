import { AxiosError } from "axios";
import axios from "../api/axios";
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {};

const RegisterForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      axios
        .post("register/", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.status === 201 || 200) {

            toast.info("You are registered! Log in now");
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response) {
              const errorMessage = error.response.data.error || "Unknown exception";
              toast.error(errorMessage);
            } else if (error.request) {
              toast.error("Server request error");
            } else {
              toast.error("Unknown exception");
            }
          }
        });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorMessage = error.response.data.error || "Unknown exception";
          toast.error(errorMessage);
        } else if (error.request) {
          toast.error("Server request error");
        } else {
          toast.error("Unknown exception");
        }
      }
    }
  };

  return (
    <div className="form__layout">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__item">
          <label className="form__item--label">Email:</label>
          <br />
          <input
            className="form__item--input"
            type="email"
            autoComplete="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="form__item">
          <label className="form__item--label">Password:</label>
          <br />
          <input className="form__item--input" type="password" autoComplete="new-password" />
        </div>
        <div className="form__item">
          <label className="form__item--label">Confirm password:</label>
          <br />
          <input
            className="form__item--input"
            autoComplete="new-password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="form__btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
