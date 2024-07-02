import { useEffect, useState } from "react";
import RenderComponent from "../../../components/RenderComponent";
import ProductCard from "./ProductCard/ProductCard";
import ProductList from "./ProductList/ProductList";
import { useAppDispatch } from "../../../hooks/redux";
import "./Shop.css";
import axios from "../../../api/axios";
import Pagination from "./CustomPagination/CustomPagination";
import HoverableSelect from "./HoverableSelect/HoverableSelect";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";
import { setCount, setCurrentLink } from "../../../store/reducers/ProductSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { IProduct } from "../../../models/product";

// Можна підвантажувати з сервера, але це дефолтні параметри сортування, тому потреби в кастомних немає
// Варто спочатку писати дані, де placeholder - найдовше слово (за довжиною в пікселях, а не буквах)
const OPTIONS = [
  { value: "name", placeholder: "Name" },
  { value: "-name", placeholder: "Name" },
  { value: "price", placeholder: "Price" },
  { value: "-price", placeholder: "Price" },
];

interface ShopProps {
  query: string | null;
}

const Shop: React.FC<ShopProps> = ({ query }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isList, setIsList] = useState(false);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const sortProducts = (option: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("ordering", option);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  // З кожною зміною запиту отримуємо відповідний список продуктів
  // Не використовуємо dispatch, тому що потрібна синхронність
  useEffect(() => {
    axios
      .get(`products?${query}`)
      .then((response) => {
        setProducts(response.data.results);
        dispatch(setCurrentLink(`products?${query}`));
        dispatch(setCount(response.data.count));
      })
      .catch((error) => {
        console.error("Помилка отримання даних:", error);
      });
  }, [dispatch, query]);

  return (
    <article className="shop" id="shop">
      <section className="shop__options">
        <div className="shop__options--sorting">
          <HoverableSelect handleClick={sortProducts} options={OPTIONS} />
        </div>
        <div className="shop__options--change-mode">
          <button
            className={isList ? "shop__options__btns" : "shop__options__btns active"}
            onClick={() => {
              setIsList(!isList);
            }}
          >
            <AppsIcon className="shop__options__btns--tiles" fontSize="medium" />
          </button>
          {window.innerWidth > 576 && (
            <button
              className={isList ? "shop__options__btns active" : "shop__options__btns"}
              onClick={() => {
                setIsList(!isList);
              }}
            >
              <ViewListIcon className="shop__options__btns--list" fontSize="medium" />
            </button>
          )}
        </div>
      </section>
      {isList && window.visualViewport!.width > 576 ? (
        <section className="table">
          <table className="product__table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.length !== 0 ? (
                products.map((product) => <ProductList product={product} />)
              ) : (
                <div>Products undefined</div>
              )}
            </tbody>
          </table>
          <Pagination />
        </section>
      ) : (
        <section className="cards">
          {products.length !== 0 ? (
            <RenderComponent
              items={products}
              renderItem={(product) => <ProductCard key={product.id} product={product} />}
            />
          ) : (
            <div>Products undefined</div>
          )}
        </section>
      )}
    </article>
  );
};

export default Shop;
