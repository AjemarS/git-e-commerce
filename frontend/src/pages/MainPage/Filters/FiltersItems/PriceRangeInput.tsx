import { Slider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import ExpandIcon from "../ExpandIcon";

interface PriceRangeInputProps {
  title: string;
  onFilterChange: (selected: number[]) => void;
  onFocus: (id: string) => void;
}

const PriceRangeInput: React.FC<PriceRangeInputProps> = ({ title, onFilterChange, onFocus }) => {
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(true);

  const { priceRange } = useAppSelector((state) => state.filter);

  const [price, setPrice] = useState([priceRange.minPrice, priceRange.maxPrice]);
  const [minPrice, setMinPrice] = useState(priceRange.minPrice);
  const [maxPrice, setMaxPrice] = useState(priceRange.maxPrice);

  // Використовуємо для того щоб змінювати значення в числових input'ах, як тільки завантажаться
  useEffect(() => {
    setPrice([priceRange.minPrice, priceRange.maxPrice]);
    setMinPrice(priceRange.minPrice);
    setMaxPrice(priceRange.maxPrice);
  }, [priceRange]);

  const handlePriceRangeChange = (e: Event, value: number | number[]) => {
    // В нас завжди буде number[], тому можна дозволити таку штуку
    const priceRange = value as number[];
    setPrice(priceRange);

    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
  };

  // Виключаємо можливість "поганого" значення у e.target.value
  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice((prevRange) => [parseInt(e.target.value, 10), prevRange[1]]);
    setMinPrice(parseInt(e.target.value, 10));
  };

  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice((prevRange) => [prevRange[0], parseInt(e.target.value, 10)]);
    setMaxPrice(parseInt(e.target.value, 10));
  };

  const handleFocus = () => {
    onFocus(title);
  };

  return (
    <div className="filters__menu">
      <div
        className="filters__menu__title"
        id={title}
        onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
      >
        {title}
        <ExpandIcon
          expanded={isPriceFilterOpen}
          onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
        />
      </div>
      <div
        className="filters__menu__price"
        style={isPriceFilterOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      >
        <div className="filters__menu__price--inputs">
          <input
            type="number"
            min={priceRange.minPrice}
            max={priceRange.maxPrice}
            value={minPrice}
            onChange={handleMinPrice}
            onFocus={handleFocus}
          />
          -
          <input
            type="number"
            min={priceRange.minPrice}
            max={priceRange.maxPrice}
            value={maxPrice}
            onChange={handleMaxPrice}
            onFocus={handleFocus}
          />
        </div>
        <div className="filters__menu__price--slider">
          <Slider
            getAriaLabel={() => "Price range"}
            value={price}
            onChange={handlePriceRangeChange}
            onChangeCommitted={() => onFilterChange(price)}
            onFocus={handleFocus}
            max={priceRange.maxPrice}
            min={priceRange.minPrice}
            valueLabelDisplay="auto"
            name="Price"
            style={{ color: "olive" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeInput;
