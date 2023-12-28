import { useState } from "react";
import { IProduct } from "../../../models/product";
import RenderComponent from "../../../components/RenderComponent";
import ProductCard from "./ProductCard/ProductCard";
import ProductList from "./ProductList/ProductList";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setCount, setCurrentLink, setProducts } from "../../../store/reducers/ProductSlice";
import "./Shop.css";
import axios from "../../../api/axios";
import Pagination from "./CustomPagination/CustomPagination";
import HoverableSelect from "./HoverableSelect/HoverableSelect";
import useApiProducts from "../../../hooks/useApiProducts";
import { toast } from "react-toastify";

const Shop: React.FC = () => {
  const [isList, setIsList] = useState(false);

  const OPTIONS = [
    { value: "name", placeholder: "Ascending name" },
    { value: "-name", placeholder: "Descending name" },
    { value: "price", placeholder: "Ascending price" },
    { value: "-price", placeholder: "Descending price" },
  ];
  
  const { products } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();

  const sortProducts = (option: string) => {
    // const { products, error } = useApiProducts(`products?ordering=${option}`);

    // if (error) {
    //   toast.error(error.message);
    // } else if (products) {
    //   dispatch(setProducts(products.results));
    //   dispatch(setCurrentLink(`products?ordering=${option}`));
    //   dispatch(setCount(products.count));
    // }
  };

  return (
    <article className="shop">
      <section className="shop__options">
        <div className="shop__options--sorting">
          Sort by:&nbsp;&nbsp;
          <HoverableSelect handleClick={sortProducts} options={OPTIONS} />
        </div>
        <div className="shop__options--change-mode">
          <button
            className={isList ? "shop__options__btns" : "shop__options__btns active"}
            onClick={() => {
              setIsList(!isList);
            }}
          >
            <img src="../assets/icons-small-icons.png" alt=" " />
          </button>
          <button
            className={isList ? "shop__options__btns active" : "shop__options__btns"}
            onClick={() => {
              setIsList(!isList);
            }}
          >
            <img src="../assets/icons-list.png" alt=" " />
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
