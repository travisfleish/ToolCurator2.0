'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import { X } from 'lucide-react';
import { Inter } from 'next/font/google';
import MobileMenu from './MobileMenu';
import { useRouter } from 'next/navigation';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const headerRef = useRef(null);
  const router = useRouter();

  // Navigation items
  const navItems = [
    {
      label: "Home",
      href: "/",
      onClick: (e) => {
        e.preventDefault();
        router.push('/');
        setMenuOpen(false);
      }
    },
    {
      label: "Resources",
      href: "/resources",
      onClick: (e) => {
        e.preventDefault();
        router.push('/resources');
        setMenuOpen(false);
      }
    },
    {
      label: "Blog",
      href: "#blog-section",
      onClick: (e) => {
        e.preventDefault();
        const blogSection = document.getElementById('blog-section');
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#blog-section');
        }
        setMenuOpen(false);
      }
    },
    {
      label: "Newsletter",
      href: "#newsletter-section",
      onClick: (e) => {
        e.preventDefault();
        const newsletterSection = document.getElementById('newsletter-section');
        if (newsletterSection) {
          newsletterSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#newsletter-section');
        }
        setMenuOpen(false);
      }
    }
  ];

  // Typing animation for the title
  const fullText = "ToolCurator.ai";
  const typingSpeed = 150; // milliseconds per character

  useEffect(() => {
    let currentIndex = 0;
    let timer;

    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
        timer = setTimeout(typeText, typingSpeed);
      } else {
        setTypingComplete(true);
      }
    };

    // Start typing animation after a short delay
    const startDelay = setTimeout(() => {
      typeText();
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      clearTimeout(startDelay);
    };
  }, []);

  // Parse display text to apply different styles
  const renderTitle = () => {
    const toolPart = displayText.startsWith('Tool') ? 'Tool' : displayText;
    const curatorPart = displayText.length > 4 ? displayText.substring(4, 11) : '';
    const aiPart = displayText.length > 11 ? displayText.substring(11) : '';

    return (
      <>
        <span className="font-normal text-white">{toolPart}</span>
        {curatorPart && <span className="font-bold text-white">{curatorPart}</span>}
        {aiPart && <span className="font-bold text-yellow-300">{aiPart}</span>}
        {!typingComplete && <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-[blink_1s_step-end_infinite]"></span>}
      </>
    );
  };

  return (
    <header
      ref={headerRef}
      className="relative w-full text-white shadow-lg px-4 pt-4 pb-10"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #4facfe 0%, #6a67fe 100%)'
      }}
    >
      {/* Content container */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Top: Logo + Nav */}
        <div className="flex items-center justify-between w-full mb-6">
          {/* Left: TwinBrain Logo */}
          <div className="flex flex-col items-center gap-0">
            {/* Changed from <a> to <Link> */}
            <Link href="/" className="flex items-center">
              <Image
                src="/TwinBrain_White_Transparent.png"
                alt="TwinBrain AI Logo"
                width={160}
                height={160}
              />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
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

        {/* Title Section with Typing Animation */}
        <div className="text-center mt-8 pb-6">
          <h1 className={`${inter.className} text-4xl leading-tight mb-4 tracking-tight`}>
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          <p className="text-lg mt-4 font-light text-white">
            We aggregate, curate, and simplify AI tool discovery
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

export default MobileHeader;