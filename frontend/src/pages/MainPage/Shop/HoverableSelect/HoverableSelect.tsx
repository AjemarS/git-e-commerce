import React, { useState } from "react";
import "./HoverableSelect.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort";

type Option = {
  value: string;
  placeholder: string;
};

interface HoverableSelectProps {
  handleClick: (e: string) => void;
  options: Option[];
}

const HoverableSelect: React.FC<HoverableSelectProps> = ({ options, handleClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options.at(0)?.placeholder);

  const handleOptionClick = (option: Option) => {
    handleClick(option.value);
    setSelectedOption(option.placeholder);
    setIsOpen(false);
  };

  return (
    <div
      className={`hoverable-select ${isOpen ? "open" : ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        <SortIcon className="sort-icon" fontSize="medium" />
        {selectedOption}
      </div>
      {isOpen && (
        <ul className="options-list">
          {options.map((option) => (
            <li key={option.value} onClick={() => handleOptionClick(option)}>
              {option.placeholder}
              {option.value.split("")[0] === "-" ? (
                <ArrowDownwardIcon fontSize="small" />
              ) : (
                <ArrowUpwardIcon fontSize="small" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HoverableSelect;
