import React, { useLayoutEffect, useState } from "react";
import "./Filters.css";
import axios from "../api/axios";
import RenderComponent from "./RenderComponent";
import { useAppDispatch } from "../hooks/redux";
import { setCount, setCurrentLink, setProducts } from "../store/reducers/ProductSlice";
import PriceRangeInput from "./PriceRangeInput";
import ExpandIcon from "./ExpandIcon";

type PriceRange = {
  maxPrice: number;
  minPrice: number;
};

const Filters: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);

  const [priceRange, setPriceRange] = useState<PriceRange>({ minPrice: 0, maxPrice: 100000000 }); // maxPrice настільки великий, щоб

  useLayoutEffect(() => {
    const getFiltersData = () => {
      axios
        .get("products-data/categories/")
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("Помилка отримання даних:", error);
        });

      axios
        .get("products-data/manufacturers/")
        .then((response) => {
          setManufacturers(response.data);
        })
        .catch((error) => {
          console.error("Помилка отримання даних:", error);
        });

      axios
        .get("products-data/price-range/")
        .then((response) => {
          setPriceRange({ minPrice: response.data.minPrice, maxPrice: response.data.maxPrice });
        })
        .catch((error) => {
          console.error("Помилка отримання даних:", error);
        });
    };

    getFiltersData();
  }, []);

  const [maxPrice, setMaxPrice] = useState<number>(priceRange.maxPrice);
  const [minPrice, setMinPrice] = useState<number>(priceRange.minPrice);

  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(true);
  const [isManufacturerFilterOpen, setIsManufacturerFilterOpen] = useState(true);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(true);
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);

  const dispatch = useAppDispatch();

  const buildQueryString = (filters: { [key: string]: string[] }): string => {
    const queryString =
      Object.entries(filters)
        .map(([key, values]) => `${key}=${values.join(",")}`)
        .join("&") + `&price=${minPrice},${maxPrice}`;

    return queryString;
  };

  const handleCategoryChange = (selected: string[]) => {
    setSelectedCategories(selected);
    setIsApplyButtonActive(true);
  };

  const handleManufacturerChange = (selected: string[]) => {
    setSelectedManufacturers(selected);
    setIsApplyButtonActive(true);
  };

  const handleMinPriceChange = (minPrice: number) => {
    setMinPrice(minPrice);
    setIsApplyButtonActive(true);
  };

  const handleMaxPriceChange = (maxPrice: number) => {
    setMaxPrice(maxPrice);
    setIsApplyButtonActive(true);
  };

  const handleApplyFilters = () => {
    const filters = {
      category: [...new Set(selectedCategories)],
      manufacturer: [...new Set(selectedManufacturers)],
    };

    const queryString = buildQueryString(filters);

    // console.log(filters);

    axios
      .get(`/products?${queryString}`)
      .then((response) => {
        dispatch(setProducts(response.data.results));
        dispatch(setCurrentLink(`/products?${queryString}`));
        dispatch(setCount(response.data.count));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setIsApplyButtonActive(false);
  };

  return (
    <aside className="filters">
      <div className="filters__layout">
        {isApplyButtonActive && <div className="filters__clear--btn">Clear all</div>}
        <div className="filters__menu">
          {isApplyButtonActive && (
            <button className="filters__apply__btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          )}
          <div
            className="filters__menu__title"
            onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
          >
            Categories
            <ExpandIcon
              expanded={isCategoryFilterOpen}
              onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
            />
          </div>
          <div className="filters__menu__checkboxes">
            <RenderComponent
              items={categories}
              renderItem={(category) => (
                <label
                  key={category}
                  className="filters__menu__checkboxes--label"
                  style={isCategoryFilterOpen ? { display: "block" } : { display: "none" }}
                >
                  <input
                    className="filters__menu__checkboxes--input"
                    type="checkbox"
                    onChange={() => handleCategoryChange([...selectedCategories, category])}
                  />
                  {category}
                </label>
              )}
            />
          </div>
        </div>

        <div className="filters__menu">
          <div
            className="filters__menu__title"
            onClick={() => setIsManufacturerFilterOpen(!isManufacturerFilterOpen)}
          >
            Manufacturers
            <ExpandIcon
              expanded={isManufacturerFilterOpen}
              onClick={() => setIsManufacturerFilterOpen(!isManufacturerFilterOpen)}
            />
          </div>
          <div className="filters__menu__checkboxes">
            <RenderComponent
              items={manufacturers}
              renderItem={(manufacturer) => (
                <label
                  key={manufacturer}
                  className="filters__menu__checkboxes--label"
                  style={isManufacturerFilterOpen ? { display: "block" } : { display: "none" }}
                >
                  <input
                    className="filters__menu__checkboxes--input"
                    type="checkbox"
                    onChange={() =>
                      handleManufacturerChange([...selectedManufacturers, manufacturer])
                    }
                  />
                  {manufacturer}
                </label>
              )}
            />
          </div>
        </div>

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
