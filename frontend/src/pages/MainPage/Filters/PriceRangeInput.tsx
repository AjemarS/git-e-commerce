import { Slider } from "@mui/material";
import React, { useEffect, useState } from "react";

interface PriceRangeInputProps {
  minPriceRange: number;
  maxPriceRange: number;
  onMinPriceChange: (minPrice: number) => void;
  onMaxPriceChange: (maxPrice: number) => void;
}

const PriceRangeInput: React.FC<PriceRangeInputProps> = ({
  minPriceRange,
  maxPriceRange,
  onMinPriceChange,
  onMaxPriceChange,
}) => {
  const [priceRange, setPriceRange] = useState([minPriceRange, maxPriceRange]);
  const [minPrice, setMinPrice] = useState(minPriceRange);
  const [maxPrice, setMaxPrice] = useState(maxPriceRange);

  useEffect(() => {
    setPriceRange([minPriceRange, maxPriceRange]);
    setMinPrice(minPriceRange);
    setMaxPrice(maxPriceRange);
  }, [minPriceRange, maxPriceRange]);

  const handlePriceRangeChange = (e: Event, value: number | number[]) => {
    const priceRange = value as number[];
    setPriceRange(priceRange);

    onMinPriceChange(priceRange[0]);
    onMaxPriceChange(priceRange[1]);
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
  };

  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange((prevRange) => [Number(e.target.value), prevRange[1]]);
    setMinPrice(Number(e.target.value));
    onMinPriceChange(Number(e.target.value));
  };
  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange((prevRange) => [prevRange[0], Number(e.target.value)]);
    setMaxPrice(Number(e.target.value));
    onMaxPriceChange(Number(e.target.value));
  };

  return (
    <div>
      <input
        type="number"
        id="priceMinInput"
        min={minPriceRange}
        max={maxPrice}
        value={minPrice}
        onChange={handleMinPrice}
      />
      <input
        type="number"
        id="priceMaxInput"
        min={minPrice}
        max={maxPriceRange}
        value={maxPrice}
        onChange={handleMaxPrice}
      />
      <Slider
        getAriaLabel={() => "Price range"}
        value={priceRange}
        onChange={handlePriceRangeChange}
        max={maxPriceRange}
        min={minPriceRange}
        valueLabelDisplay="auto"
        name="Price"
        color="primary"
      />
    </div>
  );
};

export default PriceRangeInput;
