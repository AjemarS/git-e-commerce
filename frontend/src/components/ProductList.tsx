import React, { FC } from "react";
import { ProductProps } from "../models/product";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList: FC<ProductProps> = ({ product }) => {

  return (
    <Link to={`/products/${product.id}`}>
      <div className="product__list">
        <div className="product__list--image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product__list--text">
          <div className="product__list--title">{product.name}</div>
          <div className="product__list--description">{product.description}</div>
          <div className="product__list--price">{product.price}$</div>
        </div>

        <div className="product__list--options">
          <button className="product__list--btn">
            Buy
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductList;
