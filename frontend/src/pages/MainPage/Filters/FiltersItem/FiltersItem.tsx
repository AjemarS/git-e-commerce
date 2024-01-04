import React, { useState, useEffect } from "react";
import ExpandIcon from "../ExpandIcon";
import RenderComponent from "../../../../components/RenderComponent";

type FiltersItemProps = {
  title: string;
  filters: string[];
  handleFilterChange: (selected: string[]) => void;
  handleApplyFilters: () => void;
};

const FiltersItem = ({
  title,
  filters,
  handleFilterChange,
  handleApplyFilters,
}: FiltersItemProps) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);

  //Оновлення стану isApplyButtonActive при зміні вибраних фільтрів
  useEffect(() => {
    setIsApplyButtonActive(selectedFilters.length > 0);
  }, [selectedFilters]);

  const selectFilter = (filter: string) => {
    const newSelectedFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((selectedFilter) => selectedFilter !== filter)
      : [...selectedFilters, filter];

    setSelectedFilters(newSelectedFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const handleCheckboxChange = () => {
    handleFilterChange([...new Set(selectedFilters)]);
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
              onClick={() => selectFilter(filter)}
            >
              <input
                className="filters__menu__checkboxes--input"
                type="checkbox"
                checked={selectedFilters.includes(filter)}
                onChange={handleCheckboxChange}
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
