import React, { useState } from "react";
import "./Filters.css";
import { useAppSelector } from "../../../hooks/redux";
import PriceRangeInput from "./PriceRangeInput";
import ExpandIcon from "./ExpandIcon";
import FiltersItem from "./FiltersItem/FiltersItem";
import { useLocation, useNavigate } from "react-router-dom";

const Filters: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(true);

  const { categories, manufacturers, priceRange } = useAppSelector((state) => state.filter);
  console.log(categories, manufacturers, priceRange);

  const [maxPrice, setMaxPrice] = useState<number>(priceRange.maxPrice);
  const [minPrice, setMinPrice] = useState<number>(priceRange.minPrice);

  const buildQueryString = (filters: { [key: string]: string[] }): string => {
    return (
      Object.entries(filters)
        .map(([key, values]) => `${key}=${values.join(",")}`)
        .join("&") + `&price=${minPrice},${maxPrice}`
    );
  };

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

  const navigate = useNavigate();
  const location = useLocation();

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategories,
      manufacturer: selectedManufacturers,
    };

    const queryString = buildQueryString(filters);

    navigate(location.pathname + "?" + queryString, { replace: true });
  };

  return (
    <aside className="filters">
      <div className="filters__layout">
        <FiltersItem
          title="Categories"
          filters={categories}
          handleApplyFilters={handleApplyFilters}
          handleFilterChange={handleCategoryChange}
        />
        <FiltersItem
          title="Manufacturers"
          filters={manufacturers}
          handleApplyFilters={handleApplyFilters}
          handleFilterChange={handleManufacturerChange}
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
            {priceRange && (
              <PriceRangeInput
                maxPriceRange={priceRange.maxPrice}
                minPriceRange={priceRange.minPrice}
                onMaxPriceChange={handleMaxPriceChange}
                onMinPriceChange={handleMinPriceChange}
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Filters;
