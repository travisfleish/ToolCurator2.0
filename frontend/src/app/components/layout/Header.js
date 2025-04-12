import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Inter } from 'next/font/google';
import MobileMenu from './MobileMenu';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Header component
const Header = ({ onMenuToggle, isMarketMap = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef(null);

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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle menu handler
  const toggleMenu = () => {
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);
    onMenuToggle?.(newMenuState);
  };

  return (
    <header
      ref={headerRef}
      className="relative w-full text-white shadow-lg px-4 pt-1 pb-8 md:pt- md:pb-20"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Image and Overlay */}
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }}
      />

      {/* Content container */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Top: Logo + Hamburger + Nav */}
        <div className="flex items-center justify-between w-full mb-6 md:mb-8">
          {/* Left: Combined Logos */}
          <div className="flex flex-col items-center gap-1 ml-15 mt-10">
            <div className="flex items-center space-x-3 ml-5">
              <Image
                src="/AI_Advantage.png"
                alt="AI Advantage Logo"
                width={isMobile ? 40 : 100}
                height={isMobile ? 40 : 80}
              />
              <span className="text-white font-bold text-2xl mr-6">×</span>
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
          </div>

          {/* Desktop Nav - UPDATED: Changed text sizes to be much larger */}
          <nav className="hidden sm:flex gap-6 text-xl sm:text-2xl md:text-xl text-white font-semibold mr-16">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.rel}
                onClick={item.onClick}
                className="hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mt-4 pb-8 md:pb-12">
          <h1 className={`${inter.className} text-5xl sm:text-7xl md:text-5xl leading-tight mt-15 mb-3 tracking-tight`}>
            {isMarketMap ? (
              <>
                <span className="font-normal text-white">AI </span>
                <span className="font-bold text-white">Marketmap</span>
              </>
            ) : (
              <>
                <span className="font-normal text-white">AI </span>
                <span className="font-bold text-white">Advantage </span>
                <span className="font-normal text-white">Resources</span>
              </>
            )}
          </h1>
          <p className={`hidden sm:block text-lg sm:text-xl md:text-2xl mt-2 font-light`}>
            {isMarketMap
              ? "Explore the AI tools ecosystem for sports professionals"
              : "Discover the best AI tools for sports professionals"
            }
          </p>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        headerRef={headerRef}
        navItems={navItems}
      />
    </header>
  );
};

export default Header;