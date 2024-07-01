import React, { useState } from "react";
import "./Filters.css";
import { useAppSelector } from "../../../hooks/redux";
import PriceRangeInput from "./FiltersItems/PriceRangeInput";
import FiltersItem from "./FiltersItems/FiltersItem";
import { useLocation, useNavigate } from "react-router-dom";

const Filters: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number[]>([]);

  const [applyButtonPosition, setApplyButtonPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { categories, manufacturers } = useAppSelector((state) => state.filter);

  // Функція для побудови рядка запиту з вибраних фільтрів
  // Спочатку розділяємо на ключ - значення, якщо значень більше ніж 1, то розділяємо комою
  // Але якщо значень немає, то спочатку додаємо пустий ключ, а потім його видаляємо
  const buildQueryString = (filters: { [key: string]: string[] | number[] }): string => {
    return Object.entries(filters)
      .map(([key, values]) => (values.length !== 0 ? `${key}=${values.join(",")}` : null))
      .filter((key) => key !== null)
      .join("&");
  };

  const handleCategoryChange = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  const handleManufacturerChange = (selected: string[]) => {
    setSelectedManufacturers(selected);
  };

  const handlePriceChange = (selected: number[]) => {
    setSelectedPrice(selected);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategories,
      manufacturer: selectedManufacturers,
      price: selectedPrice,
    };

    const queryString = buildQueryString(filters);

    navigate(location.pathname + "?" + queryString, { replace: true });
  };

  const handleFocus = (id: string) => {
    const input = document.getElementById(id);
    const rect = input && input.getBoundingClientRect();
    rect && setApplyButtonPosition({ top: rect.top + window.scrollY + 9, left: rect.right + 10 });
  };

  const handleBlur = () => {
    setApplyButtonPosition(null);
  };

  return (
    <aside className="filters">
      <div className="filters__layout">
        {applyButtonPosition && (
          <div className="overlay">
            <button
              className="filters__apply__btn"
              onClick={handleApplyFilters}
              style={{
                position: "absolute",
                top: `${applyButtonPosition.top}px`,
                left: `${applyButtonPosition.left}px`,
              }}
            >
              Apply Filters
            </button>
          </div>
        )}
        <FiltersItem
          title="Categories"
          filters={categories}
          onFilterChange={handleCategoryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <FiltersItem
          title="Manufacturers"
          filters={manufacturers}
          onFilterChange={handleManufacturerChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <PriceRangeInput
          title="Price"
          onFilterChange={handlePriceChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </aside>
  );
};

export default Filters;
