import { AxiosError } from "axios";
import axios from "../api/axios";
import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";

type Props = {};

const ResetPassworForm = (props: Props) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email: email,
    };

    try {
      const response = await axios.post("password_reset/", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.info(response.data.detail);
    } catch (error) {
      try {
        if (error instanceof AxiosError) {
          if (error.response) {
            const errorMessage = error.response.data || "Unknown exception";
            console.log(errorMessage);
            toast.error(errorMessage);
          } else if (error.request) {
            toast.error("Server request error");
          } else {
            toast.error("Unknown exception");
          }
        } else {
          console.log(error);
        }
      } catch (innerError) {
        console.log("Error in inner catch block:", innerError);
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
            required
          />
        </div>
        <button type="submit" className="form__btn">
          Reset password
        </button>
      </form>
    </div>
  );
};

export default ResetPassworForm;
