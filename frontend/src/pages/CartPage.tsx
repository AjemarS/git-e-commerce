import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { removeCartItem } from "../store/reducers/CartSlice";


type Props = {};

const CartPage = (props: Props) => {
  const { cart } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Cart</h1>
      {cart.products.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => dispatch(removeCartItem(item.id))}>Remove</button>
        </div>
      ))}
      <h3>Total price: {cart.total_price}</h3>
    </div>
  );
};

export default CartPage;
