import React, { ChangeEvent, useEffect, useState } from "react";
import "./CustomPagination.css";
import Pagination from "@mui/material/Pagination";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import axios from "../../../../api/axios";
import { setProducts } from "../../../../store/reducers/ProductSlice";

type Props = {};

const CustomPagination = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { count, currentLink } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  const handlePaginationChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setProductsByPage(page);
  };

  const setProductsByPage = (page: number) => {
    axios
      .get(currentLink, { params: { page: page } })
      .then((response) => {
        dispatch(setProducts(response.data.results));
      })
      .catch((error) => console.log(error));
  };

  //коли посилання оновлюється, тобто виконується новий запит, змінюємо сторінку на 1
  useEffect(() => {
    setCurrentPage(1);
  }, [currentLink]);

  return (
    <section className="pagination-layout">
      <Pagination
        className="pagination"
        count={count}
        page={currentPage}
        color={"primary"}
        variant="outlined"
        shape="rounded"
        onChange={handlePaginationChange}
      />
    </section>
  );
};

export default CustomPagination;
