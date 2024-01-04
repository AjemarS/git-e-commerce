import React, { useState } from "react";
import "./SearchBar.css";
import { useAppDispatch } from "../../../hooks/redux";
import axios from "../../../api/axios";
import { setCount, setCurrentLink, setProducts } from "../../../store/reducers/ProductSlice";
import SearchIcon from "@mui/icons-material/Search";

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
      <SearchIcon onClick={handleSearch} className="searchBar-btn" fontSize="large" />
    </div>
  );
};

export default SearchBar;
