import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setIsHoveredCartBox } from "../store/reducers/CartSlice";
// import axios from "../api/axios";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

type Props = {};

const CartBox = (props: Props) => {
  const { cart, isHoveredCartBox } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  // const accessToken = localStorage.getItem("accessToken");
  // 
  // axios.get("cart/", { headers: { Authorization: `Bearer ${accessToken}` } }).then((response) => {
  //   console.log(response.data);
  // });

  return (
    <div>
      <div
        className="navbar__item__btns--cart"
        onMouseEnter={() => {
          dispatch(setIsHoveredCartBox(true));
        }}
        onMouseLeave={() => {
          dispatch(setIsHoveredCartBox(false));
        }}
      >
        <Link to={"/cart"}>
          <ShoppingCartOutlinedIcon fontSize="large"/>
        </Link>
        {isHoveredCartBox && (
          <div
            className="navbar__item__popups cartBox"
            onMouseEnter={() => {
              dispatch(setIsHoveredCartBox(true));
            }}
            onMouseLeave={() => {
              dispatch(setIsHoveredCartBox(false));
            }}
          >
            {cart.products.length > 0 ? (
              <div>
                <div>
                  {cart.products.map((item) => (
                    <div key={item.id}>
                      <h3>{item.name}</h3>
                      <p>{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
                <h4>Total price: {cart.total_price}</h4>
              </div>
            ) : (
              <div>It's empty now</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartBox;
