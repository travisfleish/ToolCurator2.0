import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DEMO_CATEGORIES } from '../../utils/constants';
import CategoryCard from './CategoryCard';
import EnterpriseToolCard from './EnterpriseToolCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// EnterpriseToolCarousel component for mobile
const EnterpriseToolCarousel = ({ tools }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Handle carousel navigation
  const nextSlide = () => {
    if (tools.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tools.length);
  };

  const prevSlide = () => {
    if (tools.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + tools.length) % tools.length);
  };

  // Touch controls for swipe gesture
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance

    if (diff > threshold) {
      // Swipe left, go to next
      nextSlide();
    } else if (diff < -threshold) {
      // Swipe right, go to previous
      prevSlide();
    }
  };

  return (
    <div className="w-full relative">
      {/* Navigation arrows - only show if multiple tools */}
      {tools.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/30 p-2 rounded-full text-blue-900 hover:bg-white/50 transition shadow-md"
            aria-label="Previous tool"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/30 p-2 rounded-full text-blue-900 hover:bg-white/50 transition shadow-md"
            aria-label="Next tool"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Tool cards carousel */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {tools.map((tool, index) => (
            <div
              key={tool.id || index}
              className="w-full flex-shrink-0 px-4"
            >
              <EnterpriseToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      {tools.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {tools.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to tool ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Tool counter */}
      {tools.length > 1 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          {currentIndex + 1} of {tools.length}
        </div>
      )}
    </div>
  );
};

// Create a better version of CategoryCard for mobile with carousel functionality and reduced image height
const MobileCategoryCard = ({ category, tools }) => {
  // State for the current tool index within this category
  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  // Filter tools that match this category
  const categoryTools = tools.filter(tool => tool.category === category);

  // If no tools match this category, don't render anything
  if (categoryTools.length === 0) {
    return null;
  }

  // Get the current tool to display
  const currentTool = categoryTools[currentToolIndex % categoryTools.length];

  // Only show navigation if we have multiple tools
  const hasMultipleTools = categoryTools.length > 1;

  return (
    <div className="mb-8 border border-gray-200 rounded-xl shadow-lg bg-white flex flex-col items-center text-center">
      {/* Category header with improved styling */}
      <div className="w-full bg-blue-100 py-3 px-4 text-center border-b border-blue-200">
        <span className="font-bold text-blue-800 text-lg tracking-wide">
          {category}
        </span>
      </div>

      {/* Container with overflow visible to allow nav buttons to extend outside */}
      <div className="relative w-full" style={{ overflow: 'visible' }}>
        {/* Image container */}
        <div className="w-full h-32 overflow-hidden">
          <img
            src={currentTool.screenshot_url || '/default-screenshot.png'}
            alt={`${currentTool.name} Screenshot`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation arrows - positioned 50% on/off the edge but smaller */}
        {hasMultipleTools && (
          <>
            <button
              onClick={() => {
                setCurrentToolIndex(prev =>
                  prev === 0 ? categoryTools.length - 1 : prev - 1
                );
              }}
              className="absolute left-0 translate-x-[-40%] top-[100%] -translate-y-1/2 z-20 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-transform hover:scale-110"
              style={{ overflow: 'visible' }}
              aria-label="Previous tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={() => {
                setCurrentToolIndex(prev =>
                  (prev + 1) % categoryTools.length
                );
              }}
              className="absolute right-0 translate-x-[40%] top-[100%] -translate-y-1/2 z-20 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-transform hover:scale-110"
              style={{ overflow: 'visible' }}
              aria-label="Next tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Tool info with improved spacing */}
      <div className="p-5 flex flex-col items-center w-full">
        <h3 className="text-lg font-bold mb-1.5">
          <a
            href={currentTool.source_url}
            className="text-blue-600 hover:underline hover:text-blue-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentTool.name}
          </a>
        </h3>

        <p className="text-gray-600 text-center mt-1 mb-3 line-clamp-3 text-sm">
          {currentTool.short_description}
        </p>

        {/* Pagination dots and counter below - rearranged */}
        {hasMultipleTools && (
          <div className="flex flex-col items-center mt-2">
            <div className="flex justify-center space-x-1.5 mb-2">
              {categoryTools.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentToolIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentToolIndex === index ? 'bg-blue-500 scale-110' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to tool ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter moved below the pagination dots */}
            <div className="text-blue-600 text-xs font-medium">
              {currentToolIndex + 1}/{categoryTools.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolGrid = ({ tools, selectedFilter, selectedCategory }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Log information about tools on mount and when tools change
  useEffect(() => {
    if (isMobile) {
      console.log(`TOOLGRID MOUNTED - Filter: ${selectedFilter}, Tools: ${tools?.length || 0}`);

      if (selectedFilter === 'personal') {
        console.log('PERSONAL TOOLS:', {
          totalCount: tools?.length || 0,
          categories: [...new Set(tools?.map(t => t.category).filter(Boolean))]
        });

        // Check if tools match categories
        DEMO_CATEGORIES.forEach(category => {
          const matchCount = tools?.filter(t => t.category === category).length || 0;
          console.log(`Category "${category}": ${matchCount} matching tools`);
        });
      }
    }
  }, [tools, selectedFilter, isMobile]);

  const sectionAnimation = useScrollAnimation({
    animation: 'fade-in',
    duration: 600,
    threshold: 0.05,
  });

  if (!tools || tools.length === 0) {
    return (
      <section className="p-6 w-full">
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-gray-500 text-lg">
            {tools
              ? 'No tools found matching your criteria.'
              : 'Loading tools...'}
          </p>
        </div>
      </section>
    );
  }

  const ToolCard = ({ tool, index }) => {
    const animation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 600,
      threshold: 0.1,
    });

    return (
      <div
        ref={animation.ref}
        style={animation.style}
        className="mb-6 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center overflow-hidden"
      >
        {/* Full width image with no padding */}
        <Image
          src={tool.screenshot_url || '/default-screenshot.png'}
          alt={`${tool.name} Screenshot`}
          width={400}
          height={250}
          className="w-full h-auto object-cover"
        />

        {/* Content section */}
        <div className="p-4 w-full">
          <h3 className="text-lg font-bold">{tool.name}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
            {selectedFilter === 'personal'
              ? tool.category ||
                DEMO_CATEGORIES[index % DEMO_CATEGORIES.length]
              : tool.sector || ''}
          </span>
          <p className="text-gray-600 text-center">{tool.short_description}</p>
        </div>
      </div>
    );
  };

  const CategoryCardWrapper = ({ category, index }) => {
    const animation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 800,
      threshold: 0.1,
    });

    return (
      <div ref={animation.ref} style={animation.style}>
        <CategoryCard
          category={category}
          tools={tools}
          categoryIndex={index}
          demoCategories={DEMO_CATEGORIES}
        />
      </div>
    );
  };

  const EnterpriseCard = ({ tool, index }) => {
    const animation = useScrollAnimation({
      animation: 'fade-up',
      delay: index * 100,
      duration: 800,
      threshold: 0.1,
    });

    return (
      <div ref={animation.ref} style={animation.style}>
        <EnterpriseToolCard tool={tool} />
      </div>
    );
  };

  // Mobile layout - DIFFERENT HANDLING FOR PERSONAL VS ENTERPRISE
  if (isMobile) {
    // Special handling for personal tools on mobile
    if (selectedFilter === 'personal') {
      return (
        <section className="p-6 w-full">
          <div className="w-full">
            {/* Use the enhanced MobileCategoryCard for personal view */}
            {DEMO_CATEGORIES.map((category, index) => (
              <MobileCategoryCard
                key={category}
                category={category}
                tools={tools}
              />
            ))}
          </div>
        </section>
      );
    }

    // Mobile Enterprise View - Use Carousel
    return (
      <section className="px-4 py-6 w-full">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {tools.length} {tools.length === 1 ? 'Tool' : 'Tools'} Available
          </h3>
        </div>

        <EnterpriseToolCarousel tools={tools} />
      </section>
    );
  }

  // Desktop - personal view
  if (selectedFilter === 'personal') {
    return (
      <section
        className="p-6 w-full"
        ref={sectionAnimation.ref}
        style={sectionAnimation.style}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {DEMO_CATEGORIES.map((category, index) => (
            <CategoryCardWrapper
              key={category}
              category={category}
              index={index}
            />
          ))}
        </div>
      </section>
    );
  }

  // Desktop - enterprise view
  return (
    <section
      className="p-8 w-full"
      ref={sectionAnimation.ref}
      style={sectionAnimation.style}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {tools.map((tool, index) => (
          <EnterpriseCard key={tool.id || index} tool={tool} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ToolGrid;