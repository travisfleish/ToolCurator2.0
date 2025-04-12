'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SponsorCarousel from './components/marketing/SponsorCarousel';
import NewsletterSection from './components/marketing/NewsletterSection';
import BlogSection from './components/marketing/BlogSection';
import ToggleButtons from './components/ui/ToggleButtons';
import CategoryFilters from './components/ui/CategoryFilters';
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

// Simple Header Component that works on mobile
const SimpleHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    {
      label: "AI Marketmap",
      href: "#",
      onClick: (e) => e.preventDefault()
    },
    {
      label: "AI Blog",
      href: "https://www.twinbrain.ai/blog",
      target: "_blank",
      rel: "noopener noreferrer"
    }
  ];

  return (
    <header className="relative w-full bg-[#121620] text-white shadow-lg">
      {/* Main header bar */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative h-14 w-14">
            <Image
              src="/AI_Advantage.png"
              alt="AI Advantage Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
        </div>

        {/* Empty middle space */}
        <div className="flex-1"></div>

        {/* Menu button with two parallel lines */}
        <div className="flex justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={28} />
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="w-7 h-0.5 bg-white"></div>
                <div className="w-7 h-0.5 bg-white"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown menu - now same color as header with no border */}
      {menuOpen && (
        <div className="absolute w-full bg-[#121620] shadow-md z-50">
          <nav className="flex flex-col py-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.rel}
                onClick={(e) => {
                  if (item.onClick) item.onClick(e);
                  setMenuOpen(false);
                }}
                className="px-6 py-4 hover:bg-[#1e2433] text-base font-medium text-center"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

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
      {/* Conditionally render SimpleHeader for mobile, regular Header for desktop */}
      {isMobile ? <SimpleHeader /> : <Header />}

      {/* Toggle Buttons for Personal/Enterprise View */}
      <ScrollAnimation animation="fade-in" duration={800}>
        <ToggleButtons
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
      </ScrollAnimation>

      {/* Category Filters for Enterprise View */}
      {selectedFilter === 'enterprise' && (
        <ScrollAnimation animation="fade-up" delay={200}>
          <CategoryFilters
            selectedFilter={selectedFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isMobile={isMobile}
          />
        </ScrollAnimation>
      )}

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