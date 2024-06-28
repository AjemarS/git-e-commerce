import React, { useState, useEffect } from "react";
import ExpandIcon from "../ExpandIcon";
import RenderComponent from "../../../../components/RenderComponent";
import { useAppDispatch } from "../../../../hooks/redux";
import { selectFilter } from "../../../../store/reducers/FilterSlice";

type FiltersItemProps = {
  title: string;
  filters: string[];
  handleApplyFilters: () => void;
};

const FiltersItem = ({
  title,
  filters,
  handleApplyFilters,
}: FiltersItemProps) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);

  const dispatch = useAppDispatch()

  //Оновлення стану isApplyButtonActive при зміні вибраних фільтрів
  useEffect(() => {
    setIsApplyButtonActive(selectedFilters.length > 0);
  }, [selectedFilters]);

  const onFilterSelect = (filter: string) => {
    dispatch(selectFilter(filter))
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="filters__menu">
      {isApplyButtonActive && (
        <div className="filters__clear--btn" onClick={clearAllFilters}>
          Clear all
        </div>
      )}
      {isApplyButtonActive && (
        <button className="filters__apply__btn" onClick={handleApplyFilters}>
          Apply Filters
        </button>
      )}
      <div className="filters__menu__title" onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}>
        {title}
        <ExpandIcon
          expanded={isFilterMenuOpen}
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
        />
      </div>
      <div className="filters__menu__checkboxes">
        <RenderComponent
          items={filters}
          renderItem={(filter) => (
            <label
              key={filter}
              className="filters__menu__checkboxes--label"
              style={isFilterMenuOpen ? { display: "block" } : { display: "none" }}
              onClick={() => onFilterSelect(filter)}
            >
              <input
                className="filters__menu__checkboxes--input"
                type="checkbox"
                // onChange={handleCheckboxChange}
              />
              {filter}
            </label>
          )}
        />
      </div>
    </div>
  );
};

export default FiltersItem;
