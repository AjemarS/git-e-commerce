import React, { useState, useEffect } from "react";
import ExpandIcon from "../ExpandIcon";
import RenderComponent from "../../../../components/RenderComponent";

type FiltersItemProps = {
  title: string;
  filters: string[];
  onFilterChange: (selected: string[]) => void;
  onFocus: (id: string) => void;
};

const FiltersItem = ({ title, filters, onFilterChange, onFocus }: FiltersItemProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(true);

  const handleFocus = () => {
    onFocus(title);
  };


  // При новому фільтрі в масиві, використовуємо батьківську функцію для передачі наверх масиву фільтру
  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [onFilterChange, selectedFilters]);

  const handleInputChange = (filter: string, e: React.ChangeEvent<HTMLInputElement>) => {
    // Залежно від натиснутого чекбоксу додаємо або видаляємо новий фільтр і робимо кнопку активною
    if (e.target.checked) {
      setSelectedFilters((filters) => [...new Set([...filters, filter])]);
    } else {
      setSelectedFilters((filters) => filters.filter((f) => f !== filter));
    }
  };

  return (
    <div className="filters__menu">
      <div
        className="filters__menu__title"
        id={title}
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
      >
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
                onFocus={handleFocus}
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
