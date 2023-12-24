import "../../components/Form.css";
import { AxiosError } from "axios";
import axios from "../../api/axios";
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {};

const RegisterForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unconfirmedPassword, setUnconfirmedPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value && !emailRegex.test(value)) {
      setValidationError("Invalid email address");
    } else {
      setValidationError(null);
    }
  };

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (value && !regex.test(value)) {
      setValidationError("Invalid password");
    } else {
      setValidationError(null);
    }
  };

  const confirmPassword = (value: string) => {
    if (value === unconfirmedPassword) {
      setPassword(value);
    } else {
      setValidationError("Passwords must be same");
    }
  };

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

    // clear state
    setEmail("");
    setPassword("");
    setValidationError("");
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
            required
            title="Please enter a valid email address."
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
        </div>
        <div className="form__item">
          <label className="form__item--label">Password:</label>
          <br />
          <input
            className="form__item--input"
            type="password"
            autoComplete="new-password"
            required
            title="Password must contain 8 characters minimum and include at least one lowercase letter, one uppercase letter, one digit, and one special character."
            onChange={(e) => {
              setUnconfirmedPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
        </div>
        <div className="form__item">
          <label className="form__item--label">Confirm password:</label>
          <br />
          <input
            className="form__item--input"
            type="password"
            autoComplete="new-password"
            required
            title="Password must contain 8 characters minimum and include at least one lowercase letter, one uppercase letter, one digit, and one special character."
            onChange={(e) => {
              confirmPassword(e.target.value);
            }}
          />
        </div>
        {validationError && <p className="validation-error">{validationError}</p>}
        <button type="submit" className="form__btn" disabled={validationError !== null}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
