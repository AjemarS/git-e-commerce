import { AxiosError } from "axios";
import axios from "../api/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PasswordResetConfirmForm: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      axios
        .post("/password_reset/done/", {
          password,
          confirmPassword,
        })
        .then((response) => {
          toast.success(response.data.message);
          navigate("/login");
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
          } else {
            console.log("Unknown error: ", error);
          }
        });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response.data.error);
        } else if (error.request) {
          console.error("No response received from the server.");
        } else {
          console.error("Error setting up the request:", error.message);
        }
      } else {
        console.log("Unknown error: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Password Reset Confirmation</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          New Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetConfirmForm;
