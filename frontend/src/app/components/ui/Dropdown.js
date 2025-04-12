import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({
  title,
  options,
  selectedValue,
  onChange,
  isActive = false,
  width,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  // Find the currently selected option
  const selected = options.find(option => option.id === selectedValue) || options[0];

  // Determine what text to display on the button - use mobileName on mobile if available
  const displayText = selected ?
    (isMobile && selected.mobileName ? selected.mobileName : selected.name) :
    title;

  // Adjust the button class based on mobile - make it more compact for side-by-side layout
  const buttonClass = `flex justify-center items-center w-full 
                      ${isMobile ? 'px-2 py-2 text-sm' : 'px-4 py-3 text-lg'} font-bold
                      border border-gray-300 rounded-lg shadow-md
                      ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}
                      transition whitespace-nowrap`;

  // Width style based on the provided width or mobile default
  const widthStyle = width ? { width: `${width}px` } : {};

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
      style={widthStyle}
    >
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className={buttonClass}
      >
        <span className={`mr-${isMobile ? '1' : '4'}`}>{displayText}</span>
        <ChevronDown size={isMobile ? 14 : 20} className={`transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200"
          style={widthStyle}
        >
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`block w-full text-left 
                        ${isMobile ? 'px-2 py-2 text-xs' : 'px-4 py-3 text-base'} 
                        hover:bg-gray-100 whitespace-nowrap
                        ${selectedValue === option.id ? "bg-blue-50 font-bold" : ""}`}
            >
              {isMobile && option.mobileName ? option.mobileName : option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;