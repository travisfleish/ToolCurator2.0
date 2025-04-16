import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const MobileMenu = ({ isOpen, onClose, headerRef, navItems }) => {
  // Add effect to handle body scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 menu-fade-in"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Menu container with matching gradient background */}
      <div
        className="h-full"
        style={{
          background: 'linear-gradient(to right, #4facfe 0%, #6a67fe 100%)'
        }}
      >
        {/* EXACT COPY OF HEADER STRUCTURE */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          {/* Top: Logo + Close button - IDENTICAL to header structure */}
          <div className="flex items-center justify-between w-full px-4 pt-4 mb-6">
            {/* Left: TwinBrain Logo */}
            <div className="flex flex-col items-center gap-0">
              <Image
                src="/TwinBrain_White_Transparent.png"
                alt="TwinBrain AI Logo"
                width={160}
                height={160}
              />
            </div>

            {/* Mobile Close Button */}
            <button onClick={onClose} className="text-white focus:outline-none">
              <X size={28} />
            </button>
          </div>

          {/* Title Section - EXACTLY MATCHING THE HEADER */}
          <div className="text-center mt-8 pb-6">
            <h1 className={`${inter.className} text-4xl leading-tight mb-4 tracking-tight`}>
              <span className="font-normal text-white">Tool</span>
              <span className="font-bold text-white">Curator</span>
              <span className="font-bold text-yellow-300">.ai</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg mt-4 font-light text-white">
              We aggregate, curate, and simplify AI tool discovery
            </p>
          </div>
        </div>

        {/* Navigation Links - MOVED FURTHER DOWN TO MATCH SCREENSHOTS */}
        <div className="flex flex-col items-center w-full mt-16">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className="text-white text-xl py-4 hover:bg-white/10 w-full text-center"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;