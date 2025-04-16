import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DEMO_CATEGORIES } from '../../utils/constants';
import CategoryCard from './CategoryCard';
import EnterpriseToolCard from './EnterpriseToolCard';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the AI enterprise categories
const ENTERPRISE_AI_CATEGORIES = [
  "Agent Builders",
  "LLM Frameworks & Orchestration",
  "Model Hubs & Customization",
  "AI Coding & App Platforms",
  "Embeddings & Vector Search",
  "Enterprise Search & QA"
];

// Unified MobileCategoryCard component for both personal and enterprise views
const MobileCategoryCard = ({ category, tools, isEnterprise = false }) => {
  // State for the current tool index within this category
  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  // Filter tools - for personal view, we need to filter by category
  // For enterprise view, we expect pre-filtered tools by sector
  const categoryTools = isEnterprise ? tools : tools.filter(tool => tool.category === category);

  // If no tools match this category, don't render anything
  if (categoryTools.length === 0) {
    return null;
  }

  // Get the current tool to display
  const currentTool = categoryTools[currentToolIndex % categoryTools.length];

  // Only show navigation if we have multiple tools
  const hasMultipleTools = categoryTools.length > 1;

  return (
    <div className="mb-8 border border-gray-200 rounded-xl shadow-lg bg-white flex flex-col items-center text-center overflow-hidden">
      {/* Category header with improved styling */}
      <div className="w-full bg-blue-100 py-3 px-4 text-center border-b border-blue-200">
        <span className="font-bold text-blue-800 text-lg tracking-wide">
          {category}
        </span>
      </div>

      {/* Image container with relative positioning for buttons */}
      <div className="relative w-full">
        {/* Navigation arrows - enhanced with background */}
        {hasMultipleTools && (
          <>
            <button
              onClick={() => {
                setCurrentToolIndex(prev =>
                  prev === 0 ? categoryTools.length - 1 : prev - 1
                );
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
              aria-label="Next tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Simple image with reduced height using a fixed height container */}
        <div className="w-full h-32 overflow-hidden">
          <img
            src={currentTool.screenshot_url || '/default-screenshot.png'}
            alt={`${currentTool.name} Screenshot`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tool counter (e.g., "1/3") - shows actual number */}
        {hasMultipleTools && (
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
            {currentToolIndex + 1}/{categoryTools.length}
          </div>
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
          <ExternalLink className="ml-2 w-4 h-4 text-gray-500 inline" />
        </h3>

        {/* Show sector badge for enterprise tools */}
        {isEnterprise && currentTool.sector && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
            {currentTool.sector}
          </span>
        )}

        <p className="text-gray-600 text-center mt-1 mb-3 line-clamp-3 text-sm">
          {currentTool.short_description}
        </p>

        {/* Pagination dots for multiple tools - improved styling */}
        {hasMultipleTools && (
          <div className="flex justify-center mt-2 space-x-1.5">
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

  // Mobile layout - UNIFIED APPROACH FOR BOTH PERSONAL AND ENTERPRISE
  if (isMobile) {
    return (
      <section className="p-6 w-full">
        <div className="w-full">
          {selectedFilter === 'personal' ? (
            // Personal view - map through DEMO_CATEGORIES
            DEMO_CATEGORIES.map((category, index) => (
              <MobileCategoryCard
                key={category}
                category={category}
                tools={tools}
                isEnterprise={false}
              />
            ))
          ) : (
            // Enterprise view - map through ENTERPRISE_AI_CATEGORIES
            ENTERPRISE_AI_CATEGORIES.map((category, index) => {
              // Filter tools for this specific enterprise category
              const categoryTools = tools.filter(tool => tool.sector === category);
              return (
                <MobileCategoryCard
                  key={category}
                  category={category}
                  tools={categoryTools}
                  isEnterprise={true}
                />
              );
            })
          )}
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