import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { DEMO_CATEGORIES } from '../../utils/constants';

const MobileToolCarousel = ({
  tools,
  selectedFilter = 'personal',
  demoCategories = DEMO_CATEGORIES
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Determine which categories to use based on filter
  const categories = selectedFilter === 'personal'
    ? demoCategories
    : [...new Set(tools.map(tool => tool.sector).filter(Boolean))];

  // Group tools by category
  const categorizedTools = categories.map(category => ({
    category,
    tools: tools.filter(tool =>
      selectedFilter === 'personal'
        ? tool.category === category
        : tool.sector === category
    )
  })).filter(group => group.tools.length > 0);

  // Ensure we have tools to display
  if (categorizedTools.length === 0) {
    return (
      <div className="w-full flex justify-center px-8">
        <p>No tools available</p>
      </div>
    );
  }

  // Get current category group
  const currentCategoryGroup = categorizedTools[currentSlide];

  // Determine which tool to show (first tool in the current category)
  const currentTool = currentCategoryGroup?.tools[0];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === categorizedTools.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? categorizedTools.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
        aria-label="Previous category"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Carousel Item */}
      <div className="w-full flex justify-center px-8">
        <div className="w-full p-4 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center">
          {/* Category Header */}
          <div className="w-full bg-blue-100 py-2 px-3 text-center mb-4">
            <span className="font-bold text-blue-800 text-lg">
              {currentCategoryGroup?.category}
            </span>
          </div>

          {currentTool && (
            <>
              <img
                src={currentTool.screenshot_url || "/default-screenshot.png"}
                alt={`${currentTool.name} Screenshot`}
                className="w-full h-auto rounded-lg mb-4"
              />

              <h3 className="text-lg font-bold flex items-center justify-center">
                <a
                  href={currentTool.source_url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentTool.name}
                </a>
                <ExternalLink className="ml-2 w-4 h-4 text-gray-500" />
              </h3>

              {/* Category/Sector Badge */}
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
                {selectedFilter === 'personal'
                  ? currentTool.category
                  : currentTool.sector}
              </span>

              <p className="text-gray-600 text-center">
                {currentTool.short_description}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
        aria-label="Next category"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {categorizedTools.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileToolCarousel;