import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import { Menu, X } from 'lucide-react';
import { Inter } from 'next/font/google';
import MobileMenu from './MobileMenu';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  // State for typing animation
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  // State for word-by-word animation
  const [showAggregate, setShowAggregate] = useState(false);
  const [showCurate, setShowCurate] = useState(false);
  const [showSimplify, setShowSimplify] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  const fullText = "ToolCurator.ai";
  const typingSpeed = 150; // milliseconds per character

  // Typing animation effect
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

        // Schedule the word animations after typing completes
        setTimeout(() => setShowAggregate(true), 300);
        setTimeout(() => setShowCurate(true), 600);
        setTimeout(() => setShowSimplify(true), 900);
        setTimeout(() => setShowSecondLine(true), 1200);
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

  // Navigation items - with added Resources link
  const navItems = [
    {
      label: "Home",
      href: "/",
      onClick: (e) => {
        e.preventDefault();
        router.push('/');
      }
    },
    // {
    //   label: "Resources",
    //   href: "/resources",
    //   onClick: (e) => {
    //     e.preventDefault();
    //     router.push('/resources');
    //   }
    // },
    {
      label: "Blog",
      href: "#blog-section",
      onClick: (e) => {
        e.preventDefault();
        const blogSection = document.getElementById('blog-section');
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If blog section doesn't exist on current page, navigate to the blog page
          router.push('/#blog-section');
        }
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
          // If newsletter section doesn't exist on current page, navigate to home page newsletter
          router.push('/#newsletter-section');
        }
      }
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

  // Parse display text to apply different styles
  const renderTitle = () => {
    const toolPart = displayText.startsWith('Tool') ? 'Tool' : displayText;
    const curatorPart = displayText.length > 4 ? displayText.substring(4, 11) : '';
    const aiPart = displayText.length > 11 ? displayText.substring(11) : '';

    return (
      <>
        <span className="font-normal text-white">{toolPart}</span>
        {curatorPart && <span className="font-bold text-white">{curatorPart}</span>}
        {aiPart && <span className="font-bold text-gray-400">{aiPart}</span>}
        {!typingComplete && <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-[blink_1s_step-end_infinite]"></span>}
      </>
    );
  };

  // Animation styles for the bouncing words
  const bounceAnimationStyle = {
    transform: 'translateY(-20px)',
    opacity: 0,
    display: 'inline-block'
  };

  const visibleBounceStyle = {
    transform: 'translateY(0)',
    opacity: 1,
    transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease'
  };

  return (
    <header
      ref={headerRef}
      className="relative w-full text-white shadow-lg px-4 pt-4 pb-16 md:pt-0 md:pb-10"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #e86f0c 0%, #9f0909 100%)'
      }}
    >
      {/* Content container */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Top: Logo + Nav */}
        <div className="flex items-center justify-between w-full mb-6 md:mb-8">
          {/* Left: TwinBrain Logo with "POWERED BY" text */}
          <div className="flex flex-col items-center gap-0 ml-4">
            <a
                href="https://www.twinbrain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Image
                  src="/TwinBrain_White_Transparent.png"
                  alt="TwinBrain AI Logo"
                  width={200}
                  height={200}
                />
              </a>
            </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex gap-6 text-lg text-white font-medium mr-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target || "_self"}
                rel={item.rel || ""}
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

        {/* Title Section with Typing Animation */}
        <div className="text-center mt-12 pb-8 md:pb-12">
          <h1 className={`${inter.className} text-5xl sm:text-7xl md:text-6xl leading-tight mb-4 tracking-tight`}>
            {renderTitle()}
          </h1>

          {/* Animated subtitle with bouncing words */}
          <p className="text-lg sm:text-xl md:text-2xl mt-4 font-light text-white h-8">
            We {' '}
            <span style={{
              ...bounceAnimationStyle,
              ...(showAggregate ? visibleBounceStyle : {})
            }}>
              aggregate,
            </span>{' '}
            <span style={{
              ...bounceAnimationStyle,
              ...(showCurate ? visibleBounceStyle : {})
            }}>
              curate,
            </span>{' '}
            <span style={{
              ...bounceAnimationStyle,
              ...(showSimplify ? visibleBounceStyle : {})
            }}>
              and simplify
            </span>{' '}
            AI tool discovery
          </p>

          {/* Second line with fade in */}
          <p className={`text-base sm:text-lg mt-2 font-light text-white transition-opacity duration-1000 ${showSecondLine ? 'opacity-90' : 'opacity-0'}`}>
            Spend your time building, not searching
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