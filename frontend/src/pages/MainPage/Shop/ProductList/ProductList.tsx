import React, { FC } from "react";
import { ProductProps } from "../../../../models/product";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList: FC<ProductProps> = ({ product }) => {
  return (
    <tr>
      <td>
        <Link to={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} />{" "}
        </Link>
      </td>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td>{product.price}$</td>
      <td>
        <button className="product__table--btn">Buy</button>
      </td>
    </tr>
  );
};

export default ProductList;
