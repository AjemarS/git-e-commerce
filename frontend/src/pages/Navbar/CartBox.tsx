import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addQuantity, setIsHoveredCartBox, subtractQuantity } from "../../store/reducers/CartSlice";
// import axios from "../api/axios";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Add, ArrowForward, Remove } from "@mui/icons-material";

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
        // onMouseLeave={() => {
        //   dispatch(setIsHoveredCartBox(false));
        // }}
      >
        <Link to={"/cart"}>
          <ShoppingCartOutlinedIcon fontSize="large" />
        </Link>
        {isHoveredCartBox && (
          <div
            className="cart-box navbar__item__popups"
            onMouseEnter={() => {
              dispatch(setIsHoveredCartBox(true));
            }}
            // onMouseLeave={() => {
            //   dispatch(setIsHoveredCartBox(false));
            // }}
          >
            {cart.products.length > 0 ? (
              <div className="cart-box__content">
                <div className="cart-box__title">
                  <div className="cart-box__title--text">Cart</div>
                  <Link to={"/cart"} className="cart-box__title--btn">
                    <ArrowForward />
                  </Link>
                </div>
                <div className="cart-box__list">
                  {cart.products.map((item) => (
                    <div key={item.id} className="cart-box__item">
                      <img className="cart-box__item--img" src={item.image} alt="" />
                      <div className="cart-box__item__info">
                        <div className="cart-box__item__info--title">{item.name}</div>
                        <div className="cart-box__item__info__price">
                          <Add
                            className="cart-box__btn--quantity"
                            onClick={() => dispatch(addQuantity(item.id))}
                          >
                            +
                          </Add>
                          {item.quantity}
                          <Remove
                            className="cart-box__btn--quantity"
                            onClick={() => dispatch(subtractQuantity(item.id))}
                            fontSize="small"
                          >
                            -
                          </Remove>
                        </div>
                      </div>
                      <div className="cart-box__item__info__price--text">{item.price}$</div>
                    </div>
                  ))}
                </div>
                <div className="cart-box__total">Total price: {cart.total_price}$</div>
              </div>
            ) : (
              <div className="cart-box__empty">{"It's empty here :-("}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartBox;
