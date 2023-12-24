import { useState, FC } from "react";
import "./ProductCard.css";
import { ProductProps } from "../../../../models/product";
import { addCartItem, setIsHoveredCartBox, setCart } from "../../../../store/reducers/CartSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import axios from "../../../../api/axios";
import { toast } from "react-toastify";

const ProductCard: FC<ProductProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const [addToCartCount, setAddToCartCount] = useState(0);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const data = {
    id: product.id,
    quantity: addToCartCount,
  };

  const accessToken = localStorage.getItem("accessToken");

  const addToCart = () => {
    axios
      .post("cart/", data, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        toast.success(response.data.detail, { autoClose: 1000 });
      })
      .catch((error) => console.error("Error adding to cart:", error));
    axios
      .get("cart/", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        setCart(response.data);
      })
      .catch((error) => console.error("Error getting cart:", error));
    dispatch(setIsHoveredCartBox(false)); //eslint-disable-next-line
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault();
      setAddToCartCount((prevCount: number) => prevCount + 1);
      dispatch(
        addCartItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      );
      dispatch(setIsHoveredCartBox(true));

      addToCart();
    } else toast.info("You need to be logged in!");
  };

  return (
    <a href="# ">
      <div className="product__card">
        <div className="product__card--title">{product.name}</div>
        <div className="product__card--image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product__card--bottom">
          <div className="product__card--price">{product.price}$</div>
          <div className="product__card--btns">
            <button className="product__card__btn--buy" onClick={handleAddToCart}>
              Buy
            </button>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
