'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/layout/Footer';
import BlogSection from '../components/marketing/BlogSection';
import { Inter } from 'next/font/google';
import { Download } from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';
import ScrollAnimation from '../components/ui/ScrollAnimation';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Custom Mobile Header with smaller text
const CustomMobileHeader = ({ isMarketMap = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    {
      label: "AI Marketmap",
      href: "/marketmap",
      onClick: (e) => {
        if (window.location.pathname === "/marketmap") {
          e.preventDefault();
        }
      }
    },
    {
      label: "AI Blog",
      href: "https://www.twinbrain.ai/blog",
      target: "_blank",
      rel: "noopener noreferrer"
    }
  ];

  return (
    <header className="relative w-full text-white shadow-lg">
      {/* Background with SIL_bg.jpg */}
      <div className="absolute inset-0 z-0">
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/SIL_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)',
            zIndex: 0
          }}
        />
        {/* Dark overlay to ensure text is readable */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1
          }}
        />
      </div>

      {/* Main header bar */}
      <div className="flex items-center justify-between px-4 py-4 relative z-10">
        {/* Title text - made smaller */}
        <div className="flex items-center">
          <h3 className="text-sm font-medium">AI Advantage Program</h3>
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
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="w-7 h-0.5 bg-white"></div>
                <div className="w-7 h-0.5 bg-white"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Center title - added for the main title */}
      <div className="text-center pb-4 relative z-10 px-4">
        <h1 className="text-3xl font-bold">
          {isMarketMap ? "AI Marketmap" : "AI Advantage"}
        </h1>
        <p className="text-sm opacity-80 mt-1 mb-0 font-normal">
          {isMarketMap
            ? "Explore the sports AI tools ecosystem"
            : "Resources for sports professionals"
          }
        </p>
      </div>

      {/* Dropdown menu - using same dark overlay */}
      {menuOpen && (
        <div className="absolute w-full z-50 relative">
          {/* Use same background and overlay for consistency */}
          <div className="absolute inset-0 z-0">
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "url('/SIL_bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%)',
                zIndex: 0
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                zIndex: 1
              }}
            />
          </div>

          <nav className="flex flex-col py-3 relative z-10">
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
                className="px-6 py-4 hover:bg-black/30 text-base font-medium text-center"
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

export default function MarketMapPage() {
  const isMobile = useMediaQuery();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Check if we're mounted (important for SSR)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasMounted(true);
    }
  }, []);

  // Magnification parameters
  const zoom = 2.0;
  const magnifierSize = 300;

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (containerRef.current && !isMobile && magnifierEnabled) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setPosition({ x, y });
    }
  };

  // Toggle magnifier on/off
  const toggleMagnifier = () => {
    setMagnifierEnabled(!magnifierEnabled);
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    // Create a link element
    const link = document.createElement('a');
    // Set the href to the PDF file path
    link.href = '/AI_For_Sports_Market_Map.pdf';
    // Set download attribute with filename
    link.download = 'AI_For_Sports_Market_Map.pdf';
    // Append to document
    document.body.appendChild(link);
    // Trigger click
    link.click();
    // Remove link from document
    document.body.removeChild(link);
  };

  // Show loading state until client-side code has determined device type
  if (!hasMounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#2a50a3" }}>
      {/* Conditionally render either the custom mobile header or the original desktop header */}
      {isMobile ? (
        /* Mobile Header - use the CustomMobileHeader component */
        <CustomMobileHeader isMarketMap={true} />
      ) : (
        /* Desktop Header - keep the original implementation */
        <header className="w-full relative text-white shadow-lg">
          {/* Background Image and Overlay */}
          <div className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/SIL_bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%)',
            }}
          />
          <div className="absolute inset-0 bg-black/70 z-1" />

          <div className="relative z-10 px-4 py-6 mb-6">
            {/* Top: Logo + Nav */}
            <div className="flex items-center justify-between w-full mb-6">
              {/* Left: Combined Logos */}
              <div className="flex items-center space-x-3 ml-8 mt-5">
                <Link href="/" className="transition-opacity hover:opacity-90">
                  <Image
                    src="/AI_Advantage.png"
                    alt="AI Advantage Logo"
                    width={isMobile ? 40 : 100}
                    height={isMobile ? 40 : 80}
                  />
                </Link>
                <span className="text-white font-bold text-xl">×</span>
                <a
                  href="https://www.sportsilab.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/sil-logo.png"
                    alt="Sports Innovation Lab Logo"
                    width={isMobile ? 70 : 140}
                    height={isMobile ? 25 : 60}
                  />
                </a>
              </div>

              {/* Navigation links */}
              <nav className="hidden sm:flex gap-6 mr-10 text-lg text-white font-semibold">
                <Link href="/" className="hover:text-blue-300 transition-colors">Home</Link>
                <Link href="/marketmap" className="text-blue-300">AI Marketmap</Link>
                <a href="https://www.twinbrain.ai/blog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">AI Blog</a>
              </nav>
            </div>

            {/* Title and Magnifier Button - only in desktop header */}
            <ScrollAnimation animation="fade-down" duration={800}>
              <div className="text-center mb-6">
                <h1 className={`${inter.className} text-4xl sm:text-5xl font-semibold tracking-tight mt-12 mb-15`}>
                  AI For Sports <span className="font-extrabold">Marketmap</span>
                </h1>

                {/* Toggle Magnifier Button */}
                <div className="mt-4">
                  <button
                    onClick={toggleMagnifier}
                    className={`px-4 py-2 rounded-lg transition-colors ${magnifierEnabled ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold shadow-md cursor-pointer`}
                  >
                    {magnifierEnabled ? 'Disable Magnifying Glass' : 'Enable Magnifying Glass'}
                  </button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </header>
      )}

      {/* For mobile, add padding between header and map using the #213f99 color */}
      {isMobile && (
        <div className="w-full h-6" style={{ backgroundColor: "#213f99" }}></div>
      )}

      {/* Main content - unchanged */}
      <main className="w-full flex flex-col flex-1" style={{ backgroundColor: "#2a50a3" }}>
        {/* Interactive SVG Map */}
        <ScrollAnimation animation="fade-up" delay={200} duration={1000}>
          <div className="w-full">
            <div
              ref={containerRef}
              className="relative w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => magnifierEnabled && setIsHovering(true)}
              onMouseLeave={() => magnifierEnabled && setIsHovering(false)}
            >
              {/* Base SVG image */}
              <img
                src="/AI_For_Sports_Market_Map.svg"
                alt="AI For Sports Market Map"
                className="w-full h-auto"
                style={{ display: 'block' }}
              />

              {/* Magnifying glass effect - only shown when enabled */}
              {magnifierEnabled && isHovering && !isMobile && (
                <div
                  className="absolute rounded-full pointer-events-none overflow-hidden"
                  style={{
                    width: `${magnifierSize}px`,
                    height: `${magnifierSize}px`,
                    left: `${position.x - magnifierSize/2}px`,
                    top: `${position.y - magnifierSize/2}px`,
                    border: '3px solid white',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                    zIndex: 25
                  }}
                >
                  {/* Using a direct div with background-position for more reliable zooming */}
                  <div
                    style={{
                      width: `${magnifierSize}px`,
                      height: `${magnifierSize}px`,
                      backgroundImage: `url('/AI_For_Sports_Market_Map.svg')`,
                      backgroundPosition: `-${position.x * zoom - magnifierSize/2}px -${position.y * zoom - magnifierSize/2}px`,
                      backgroundSize: `${containerRef.current?.offsetWidth * zoom}px auto`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />

                  {/* Lens effects */}
                  <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)' }} />
                  <div
                    className="absolute rounded-full"
                    style={{
                      top: '10%',
                      left: '10%',
                      width: '25%',
                      height: '25%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                      opacity: 0.6
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollAnimation>

        {/* Instructions for mobile users - Reduced width and more spacing */}
        {isMobile && (
          <div className="text-center mx-auto mt-8 p-4 bg-blue-50 rounded-lg shadow-sm" style={{ maxWidth: "85%" }}>
            <p className="text-blue-800">
              Download the PDF version of below.
            </p>
          </div>
        )}

        {/* Extended area with download button - reduced space before Blog section */}
        <div className={`${isMobile ? 'py-8 pb-6' : 'py-16'} relative`} style={{ backgroundColor: "#2a50a3" }}>
          {/* Center the button */}
          <div className="flex justify-center">
            <button
              onClick={handleDownloadPDF}
              className={`${isMobile ? 'px-5 py-3' : 'px-10 py-4'} ${isMobile ? 'mb-2' : 'mb-10'} rounded-lg transition-all bg-yellow-500 hover:bg-yellow-600 text-white font-bold ${isMobile ? 'text-base' : 'text-xl'} shadow-lg flex items-center space-x-3 mx-auto transform hover:scale-105 duration-300 cursor-pointer`}
            >
              <Download size={isMobile ? 20 : 28} />
              <span>{isMobile ? "Download PDF" : "Download AI For Sports Market Map PDF"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Blog Section */}
      <div className="relative">
        <BlogSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}