import React, { useState } from "react";
import "./SearchBar.css";
import { useAppDispatch } from "../../hooks/redux";
import axios from "../../api/axios";
import { setCount, setCurrentLink, setProducts } from "../../store/reducers/ProductSlice";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();

  function changeSearchTerm(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    return (e.target.value = "");
  }
  const handleSearch = () => {
    axios
      .get("products", { params: { q: searchQuery } })
      .then((response) => {
        dispatch(setProducts(response.data.results));
        dispatch(setCurrentLink(`products?q=${searchQuery}`));
        dispatch(setCount(response.data.count));
        setSearchQuery("");
      })
      .catch((error) => {
        console.error("Помилка отримання даних:", error);
      });
  };

  return (
    <div className="searchBar">
      <input
        onChange={changeSearchTerm}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        value={searchQuery}
        type="text"
        placeholder="Search"
        title="Find a good by title"
      />
      <button onClick={handleSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
          <path
            fill="currentColor"
            d="m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
