'use client';

import React, { useEffect, useState } from 'react';

// Import components
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import MobileDescriptionSection from './components/ui/MobileDescriptionSection';
import Footer from './components/layout/Footer';
import SponsorCarousel from './components/marketing/SponsorCarousel';
import NewsletterSection from './components/marketing/NewsletterSection';
import BlogSection from './components/marketing/BlogSection';
import ToggleButtons from './components/ui/ToggleButtons';
import ToolGrid from './components/tools/ToolGrid';
import ScrollAnimation from './components/ui/ScrollAnimation';

// Import the animations CSS
import './animations.css';

// Simplified hook functionality
const useMediaQuery = () => {
  const [matches, setMatches] = React.useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(max-width: 768px)');
      setMatches(media.matches);

      const listener = (e) => setMatches(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  return matches;
};

// Import useToolFiltering hook (updated version with loading/error states)
import { useToolFiltering } from './hooks/useToolFiltering';

export default function Home() {
  // Use custom hooks for state management with enhanced states
  const {
    tools,
    loading,
    error,
    selectedFilter,
    selectedCategory,
    setSelectedFilter,
    setSelectedCategory,
  } = useToolFiltering();

  // Media query hook
  const isMobile = useMediaQuery();

  // State to track if initial detection has happened
  const [hasMounted, setHasMounted] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasMounted(true);

      // Add global error handler
      window.onerror = function(message, source, lineno, colno, error) {
        console.error('Global error:', message, source, lineno, colno);
        return false;
      };
    }
  }, []);

  // Log status changes for debugging
  useEffect(() => {
    console.log('Current state:', {
      filter: selectedFilter,
      category: selectedCategory,
      toolCount: tools.length,
      isMobile
    });
  }, [selectedFilter, selectedCategory, tools.length, isMobile]);

  // Show loading state until client-side code has determined device type
  if (!hasMounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center relative">
      {/* Conditionally render MobileHeader for mobile, regular Header for desktop */}
      {isMobile ? <MobileHeader /> : <Header />}

      {/* Mobile Description Section - only appears on mobile */}
      <MobileDescriptionSection isMobile={isMobile} />

      {/* Toggle Buttons for Personal/Enterprise View - Pass isMobile prop */}
      <ScrollAnimation animation="fade-in" duration={800}>
        <ToggleButtons
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          isMobile={isMobile}
        />
      </ScrollAnimation>

      {/* Loading State */}
      {loading && (
        <div className="w-full p-12 flex justify-center">
          <div className="animate-pulse text-xl">Loading tools...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full p-12 flex justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}

      {/* Tool Grid - Using ScrollAnimation */}
      {!loading && !error && (
        <ScrollAnimation animation={isMobile ? "fade-in" : "fade-up"} delay={isMobile ? 0 : 300} duration={isMobile ? 0 : 1000} className="w-full">
          <ToolGrid
            tools={tools}
            selectedFilter={selectedFilter}
            selectedCategory={selectedCategory}
          />
        </ScrollAnimation>
      )}

      {/* Fixed Newsletter Section - Using ScrollAnimation */}
      <ScrollAnimation animation={isMobile ? "fade-in" : "fade-up"} threshold={0.5} duration={isMobile ? 0 : 800} className="w-full">
        <NewsletterSection variant="fixed" />
      </ScrollAnimation>

      {/* Blog Section - Using ScrollAnimation */}
      <ScrollAnimation animation={isMobile ? "fade-in" : "fade-up"} threshold={0.1} duration={isMobile ? 0 : 800} className="w-full">
        <BlogSection />
      </ScrollAnimation>

      {/* Footer - Quick fade in with no upward movement */}
      <ScrollAnimation animation="fade-in" duration={600} className="w-full">
        <Footer />
      </ScrollAnimation>
    </div>
  );
}