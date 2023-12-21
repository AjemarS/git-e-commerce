import React, { useEffect } from "react";
// import RenderComponent from "./RenderComponent";

type Props = {};

const RecentProducts = (props: Props) => {
  function getFromCookies() {}
  useEffect(() => {
    getFromCookies();
  }, []);

  return (
    <div className="recent-products">
      <div className="recent-products__title">
        <strong>Recent products</strong>
      </div>
      <div className="recent-products__items">{/* <RenderComponent /> */}</div>
    </div>
  );
};

export default RecentProducts;
