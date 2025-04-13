import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DEMO_CATEGORIES } from '../../utils/constants';
import CategoryCard from './CategoryCard';
import EnterpriseToolCard from './EnterpriseToolCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the AI enterprise categories
const ENTERPRISE_AI_CATEGORIES = [
  "Agent Builders",
  "LLM Frameworks & Orchestration",
  "Model Hubs & Customization",
  "AI Coding & App Platforms",
  "Embeddings & Vector Search",
  "Enterprise Search & QA"
];

// MobileCategoryCard component (unchanged from your code)
const MobileCategoryCard = ({ category, tools }) => {
  // State for the current tool index within this category
  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  // Filter tools that match this category
  const categoryTools = tools.filter(tool => tool.category === category || tool.sector === category);

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

const ToolGrid = ({ tools, selectedFilter }) => {
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
    console.log(`ToolGrid - Selected Filter: ${selectedFilter}, Tools Count: ${tools?.length || 0}`);

    if (selectedFilter === 'enterprise') {
      // Log how many tools match each enterprise AI category
      ENTERPRISE_AI_CATEGORIES.forEach(category => {
        const matchCount = tools?.filter(t => t.sector === category).length || 0;
        console.log(`Enterprise Category "${category}": ${matchCount} matching tools`);
      });
    }
  }, [tools, selectedFilter]);

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

  // Mobile layout
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

    // Mobile Enterprise View - Use CategoryCard for each AI category
    return (
      <section className="px-4 py-6 w-full">
        <div className="w-full">
          {ENTERPRISE_AI_CATEGORIES.map((category, index) => {
            const categoryTools = tools.filter(tool => tool.sector === category);
            return (
              <EnterpriseToolCard
                key={category}
                tools={categoryTools}
                category={category}
              />
            );
          })}
        </div>
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
            <CategoryCard
              key={category}
              category={category}
              tools={tools}
              categoryIndex={index}
              demoCategories={DEMO_CATEGORIES}
            />
          ))}
        </div>
      </section>
    );
  }

  // Desktop - enterprise view - using CategoryCard-like layout with EnterpriseToolCard
  return (
    <section
      className="p-8 w-full"
      ref={sectionAnimation.ref}
      style={sectionAnimation.style}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {ENTERPRISE_AI_CATEGORIES.map((category, index) => {
          // Filter tools by this specific category
          const categoryTools = tools.filter(tool => tool.sector === category);

          // Return EnterpriseToolCard directly (no nested containers)
          return (
            <EnterpriseToolCard
              key={category}
              tools={categoryTools}
              category={category}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ToolGrid;