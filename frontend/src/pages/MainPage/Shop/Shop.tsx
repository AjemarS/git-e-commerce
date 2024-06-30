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
    // Перевіряємо чи пустий рядок запиту і додаємо до вже існуючого запиту або створюємо новий
    // Костиль, тому що при декількох натискань рядок запиту заповнюється ordering'ами
    query === (null || "")
      ? navigate(location.pathname + "?ordering=" + option)
      : navigate(location.pathname + "?" + query + "&ordering=" + option);
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
    <article className="shop">
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
            <AppsIcon className="shop__options__btns--tiles" fontSize="large" />
          </button>
          <button
            className={isList ? "shop__options__btns active" : "shop__options__btns"}
            onClick={() => {
              setIsList(!isList);
            }}
          >
            <ViewListIcon className="shop__options__btns--list" fontSize="large" />
          </button>
        </div>
      </section>
      <section className={isList ? "list" : "cards"}>
        {isList && (
          <section className="list-labels">
            <span>Image</span>
            <span>Name</span>
            <span>Description</span>
            <span>Price</span>
          </section>
        )}
        {products.length !== 0 ? (
          <RenderComponent
            items={products}
            renderItem={(product) =>
              isList ? (
                <ProductList key={product.id} product={product} />
              ) : (
                <ProductCard key={product.id} product={product} />
              )
            }
          />
        ) : (
          <div>Products undefined</div>
        )}
        <Pagination />
      </section>
    </article>
  );
};

export default Shop;
