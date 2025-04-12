'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const MobileHeader = ({ isMarketMap = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

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
      {/* Background with SIL_bg.jpg (same as blog section) */}
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
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative h-14 w-14 flex items-center justify-center">
            {imageLoaded ? (
              <img
                src="/AI_Advantage.png"
                alt="AI Advantage Logo"
                className="max-h-full max-w-full object-contain"
                onError={() => setImageLoaded(false)}
              />
            ) : (
              <span className="text-xl font-bold">AI</span>
            )}
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

      {/* Center title - added for the main title */}
      <div className="text-center pb-4 relative z-10 px-4">
        <h1 className="text-3xl font-bold">
          {isMarketMap ? "AI Marketmap" : "AI Advantage"}
        </h1>
        <p className="text-sm opacity-80 mt-1">
          {isMarketMap
            ? "Explore the AI tools ecosystem"
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

export default MobileHeader;