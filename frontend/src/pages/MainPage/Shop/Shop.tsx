import { useState } from "react";
import { IProduct } from "../../../models/product";
import RenderComponent from "../../../components/RenderComponent";
import ProductCard from "./ProductCard/ProductCard";
import ProductList from "./ProductList/ProductList";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import "./Shop.css";
import axios from "../../../api/axios";
import Pagination from "./CustomPagination/CustomPagination";
import HoverableSelect from "./HoverableSelect/HoverableSelect";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";
import { setCount, setCurrentLink, setProducts } from "../../../store/reducers/ProductSlice";

const Shop: React.FC = () => {
  const [isList, setIsList] = useState(false);

  // Варто спочатку писати дані, де placeholder - найдовше слово
  const OPTIONS = [
    { value: "name", placeholder: "Name" },
    { value: "-name", placeholder: "Name" },
    { value: "price", placeholder: "Price" },
    { value: "-price", placeholder: "Price" },
  ];

  const { products } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();

  const sortProducts = (option: string) => {
    axios
      .get("products", { params: { ordering: option } })
      .then((response) => {
        dispatch(setProducts(response.data.results));
        dispatch(setCurrentLink(`products?ordering=${option}`));
        dispatch(setCount(response.data.count));
      })
      .catch((error) => {
        console.error("Помилка отримання даних:", error);
      });
  };

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
        <RenderComponent
          items={products}
          renderItem={(product: IProduct) =>
            isList ? (
              <ProductList key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            )
          }
        />
        <Pagination />
      </section>
    </article>
  );
};

export default Shop;
