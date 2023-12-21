import React, { useState } from "react";
import "./HoverableSelect.css";

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
        {selectedOption}
      </div>
      {isOpen && (
        <ul className="options-list">
          {options.map((option) => (
            <li key={option.placeholder} onClick={() => handleOptionClick(option)}>
              {option.placeholder}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HoverableSelect;
