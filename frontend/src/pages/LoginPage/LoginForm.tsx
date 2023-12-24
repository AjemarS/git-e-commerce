import "../../components/Form.css";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, setUser, setUserToken, setUserId } from "../../store/reducers/UserSlice";
import { useAppDispatch } from "../../hooks/redux";
import { Link } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import axios from "../../api/axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { IUser } from "../../models/user";
import { toast } from "react-toastify";

interface CustomJwtPayload extends JwtPayload {
  user_id: number;
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("login/", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status !== 200) {
        toast.error(response.statusText);
        throw new Error("Помилка: " + response.status);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data["access"]}`;

        const userId = jwtDecode<CustomJwtPayload>(response.data.access).user_id;
        dispatch(setUserId(userId));
        localStorage.setItem("userId", `${userId}`);

        axios
          .get<IUser>(`/users/public/${userId}`)
          .then((response: AxiosResponse<IUser>) => {
            dispatch(setUser(response.data));
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

        dispatch(setUserToken(response.data));
        dispatch(login());

        toast.success("Login succesfully!", { autoClose: 2000 });

        navigate("/");
      }
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
    <div id="login-page-layout">
      <div className="form__layout">
        <form onSubmit={handleSubmit} className="form">
          <div className="form__item">
            <label className="form__item--label">Email:</label>
            <br />
            <input
              required
              className="form__item--input"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="form__item">
            <label className="form__item--label">Password:</label>
            <br />
            <input
              required
              className="form__item--input"
              type="password"
              value={password}
              autoComplete="current-password"
              minLength={8}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form__item--questions">
            <div className="form__item--question">
              <Link to="/signup">Register now</Link>
            </div>

            <div className="form__item--question">
              <Link to="/password_reset">Forgot password?</Link>
            </div>
          </div>
          <button type="submit" className="form__btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
