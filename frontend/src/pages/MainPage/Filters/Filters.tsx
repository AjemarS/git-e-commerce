import React, { useEffect, useState } from "react";
import "./Filters.css";
import axios from "../../../api/axios";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setCount, setCurrentLink, setProducts } from "../../../store/reducers/ProductSlice";
import PriceRangeInput from "./PriceRangeInput";
import ExpandIcon from "./ExpandIcon";
import FiltersItem from "./FiltersItem/FiltersItem";

const Filters: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(true);

  const dispatch = useAppDispatch();

  const { categories, manufacturers, priceRange, selectedFilters } = useAppSelector((state) => state.filter);

  const [maxPrice, setMaxPrice] = useState<number>(priceRange.maxPrice);
  const [minPrice, setMinPrice] = useState<number>(priceRange.minPrice);

  const buildQueryString = (filters: { [key: string]: string[] }): string => {
    const queryString =
      Object.entries(filters)
        .map(([key, values]) => `${key}=${values.join(",")}`)
        .join("&") + `&price=${minPrice},${maxPrice}`;

    return queryString;
  };
  useEffect(() => {
    console.log(selectedCategories, selectedManufacturers);
  }, [selectedCategories, selectedManufacturers]);

  const handleCategoryChange = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  const handleManufacturerChange = (selected: string[]) => {
    setSelectedManufacturers(selected);
  };

  const handleMinPriceChange = (minPrice: number) => {
    setMinPrice(minPrice);
  };

  const handleMaxPriceChange = (maxPrice: number) => {
    setMaxPrice(maxPrice);
  };

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategories,
      manufacturer: selectedManufacturers,
    };

    const queryString = buildQueryString(filters);

    axios
      .get(`/products?${queryString}`)
      .then((response) => {
        dispatch(setProducts(response.data.results));
        dispatch(setCurrentLink(`/products?${queryString}`));
        dispatch(setCount(response.data.count));
      })
      .catch((error) => {
        console.error("Filtering products error:", error);
      });
  };

  return (
    <aside className="filters">
      <div className="filters__layout">
        <FiltersItem
          title="Categories"
          filters={categories} 
          handleApplyFilters={handleApplyFilters}
        />
        <FiltersItem
          title="Manufacturers"
          filters={manufacturers}
          handleApplyFilters={handleApplyFilters}
        />

        <div className="filters__menu">
          <div
            className="filters__menu__title"
            onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
          >
            Price
            <ExpandIcon
              expanded={isPriceFilterOpen}
              onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
            />
          </div>
          <div
            className="filters__menu__price"
            style={isPriceFilterOpen ? { display: "block" } : { display: "none" }}
          >
            <PriceRangeInput
              maxPriceRange={priceRange.maxPrice}
              minPriceRange={priceRange.minPrice}
              onMaxPriceChange={handleMaxPriceChange}
              onMinPriceChange={handleMinPriceChange}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Filters;
