const React = require('react');
const { FILTERS } = require('../../utils/constants');

const ToggleButtons = ({
  selectedFilter,
  onFilterChange,
  isMobile
}) => {
  return React.createElement("section", {
    // Conditional margin: large on desktop, small on mobile
    className: `p-3 flex justify-center ${isMobile ? 'mt-12' : 'mt-16'} mb-5`
  },
    React.createElement("div", {
      className: "inline-flex rounded-md shadow-sm"
    },
      FILTERS.map((filter, index) =>
        React.createElement("button", {
          key: filter.id,
          onClick: () => onFilterChange(filter.id),
          className: `
            ${isMobile ? 'px-5' : 'px-6'} py-2.5 text-base 
            ${isMobile ? 'font-medium' : 'font-bold'} 
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === FILTERS.length - 1 ? "rounded-r-lg" : ""}
            ${selectedFilter === filter.id 
              ? "bg-blue-600 text-white z-10" 
              : "bg-white text-gray-800 hover:bg-gray-300"} 
            border border-gray-200
            ${index > 0 && "-ml-px"}
            transition-colors duration-150
          `
        }, isMobile && filter.shortName ? filter.shortName : filter.name)
      )
    )
  );
};

module.exports = ToggleButtons;