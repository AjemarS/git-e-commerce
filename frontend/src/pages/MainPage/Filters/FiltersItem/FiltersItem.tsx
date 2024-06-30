import React, { useState, useEffect } from "react";
import ExpandIcon from "../ExpandIcon";
import RenderComponent from "../../../../components/RenderComponent";

type FiltersItemProps = {
  title: string;
  filters: string[];
  handleApplyFilters: () => void;
  handleFilterChange: (selected: string[]) => void;
};

const FiltersItem = ({
  title,
  filters,
  handleApplyFilters,
  handleFilterChange,
}: FiltersItemProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(true);
  const [isApplyButtonActive, setIsApplyButtonActive] = useState(false);

  // При новому фільтрі в масиві, використовуємо батьківську функцію для передачі наверх масиву фільтру
  useEffect(() => {
    handleFilterChange(selectedFilters);
    setIsApplyButtonActive(selectedFilters.length > 0);
  }, [handleFilterChange, selectedFilters]);

  const handleInputChange = (filter: string, e: React.ChangeEvent<HTMLInputElement>) => {
    // Залежно від натиснутого чекбоксу додаємо або видаляємо новий фільтр і робимо кнопку активною
    if (e.target.checked) {
      setSelectedFilters((filters) => [...new Set([...filters, filter])]);
      setIsApplyButtonActive(e.target.checked);
    } else {
      setSelectedFilters((filters) => filters.filter((f) => f !== filter));
    }
  };

  return (
    <div className="filters__menu">
      {isApplyButtonActive && (
        <button
          className="filters__apply__btn"
          onClick={() => {
            handleApplyFilters();
          }}
        >
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
            >
              <input
                className="filters__menu__checkboxes--input"
                type="checkbox"
                onChange={(e) => handleInputChange(filter, e)}
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
