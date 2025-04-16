import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Maximize2 } from 'lucide-react';
import CardModal from './CardModal';

const CategoryCard = ({ category, tools, categoryIndex, demoCategories }) => {
  // State for the current tool index within this category
  const [currentToolIndex, setCurrentToolIndex] = useState(0);
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Completely separate modal state - initialized when modal opens
  const [modalToolIndex, setModalToolIndex] = useState(0);

  // Filter tools that match this category
  const categoryTools = tools.filter(tool => tool.category === category);

  // For debugging
  console.log(`Category ${category}: Matched tools: ${categoryTools.length}`);

  // If no tools match this category, show a message
  if (categoryTools.length === 0) {
    return (
      <div className="relative rounded-lg shadow-md bg-white flex flex-col items-center text-center transform transition-all duration-300 hover:scale-110
       hover:shadow-xl overflow-hidden border border-gray-200">
        <div className="w-full bg-blue-100 py-2 px-3 text-center mb-2 relative">
          <span className="font-bold text-blue-800 text-lg">
            {category}
          </span>
        </div>
        <div className="p-4 flex flex-col items-center justify-center h-48 w-full">
          <p className="text-gray-600">No tools available for this category.</p>
        </div>
      </div>
    );
  }

  // Take up to 6 tools from this category
  const displayTools = categoryTools.slice(0, 6);

  // Get the current tool to display
  const currentTool = displayTools[currentToolIndex % displayTools.length];

  // Only show navigation if we have multiple tools
  const hasMultipleTools = displayTools.length > 1;

  // Get image URL for the current tool
  const imageUrl = currentTool.screenshot_url && currentTool.screenshot_url.trim() !== ""
    ? currentTool.screenshot_url
    : "/default-screenshot.png";

  // Handler for opening the modal
  const handleOpenModal = () => {
    // Initialize modal with current index but keep states separate
    setModalToolIndex(currentToolIndex);
    setIsModalOpen(true);
  };

  // Card click handler
  const handleCardClick = (e) => {
    // Open modal when clicking the card, except for specific elements
    handleOpenModal();
  };

  return (
    <>
      <div
        className="relative rounded-lg shadow-md bg-white flex flex-col items-center text-center transform transition-all duration-300 hover:scale-102 hover:shadow-xl overflow-hidden border border-gray-200 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Category header bar */}
        <div className="w-full bg-blue-100 py-2 px-3 text-center relative">
          <span className="font-bold text-blue-800 text-lg">
            {category}
          </span>

          {/* Expand button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Expand card"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Full width image container with no padding/margins */}
        <div className="w-full relative">
          {/* Navigation arrows - only show if multiple tools and modal is closed */}
          {hasMultipleTools && !isModalOpen && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentToolIndex(prev =>
                    prev === 0 ? displayTools.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110"
                aria-label="Previous tool"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentToolIndex(prev =>
                    (prev + 1) % displayTools.length
                  );
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110"
                aria-label="Next tool"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Tool image - full width with no padding */}
          <Image
            src={imageUrl}
            alt={`${currentTool.name} Screenshot`}
            width={1280}
            height={800}
            className="w-full h-auto"
            unoptimized
          />

          {/* Tool counter (e.g., "1/3") - shows actual number */}
          {hasMultipleTools && (
            <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
              {currentToolIndex + 1}/{displayTools.length}
            </div>
          )}
        </div>

        {/* Tool info section */}
        <div className="p-4 flex flex-col items-center w-full">
          {/* Tool name and link */}
          <h3 className="text-lg font-bold flex items-center justify-center">
            <a
              href={currentTool.source_url}
              className="text-blue-600 hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking link
            >
              {currentTool.name}
              <ExternalLink className="ml-2 w-4 h-4 text-gray-500" />
            </a>
          </h3>

          {/* Tool description */}
          <p className="text-gray-600 text-center mt-2">{currentTool.short_description}</p>

          {/* Pagination dots - only for actual tools and when modal is closed */}
          {hasMultipleTools && !isModalOpen && (
            <div className="flex justify-center mt-3 space-x-1">
              {displayTools.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentToolIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentToolIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to tool ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for expanded view - completely separate state */}
      {isModalOpen && (
        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={category}
          tools={displayTools}
          currentToolIndex={modalToolIndex}
          setCurrentToolIndex={setModalToolIndex}
        />
      )}
    </>
  );
};

export default CategoryCard;