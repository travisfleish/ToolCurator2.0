"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Inter, Poppins } from 'next/font/google';
import CollapsibleChatbot from './components/CollapsibleChatbot';

// Configure fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Updated CategoryCard Component that only shows relevant category tools
const CategoryCard = ({ category, tools, categoryIndex, demoCategories }) => {
  // Create a state to track the current tool index within this category
  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  // Filter tools that match this category
  const categoryTools = tools.filter(tool => tool.category === category);

  // For debugging
  console.log(`Category ${category}: Matched tools: ${categoryTools.length}`);

  // If no tools match this category, show a message
  if (categoryTools.length === 0) {
    return (
      <div className="relative rounded-lg shadow-md bg-white flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden border border-gray-200">
        <div className="w-full bg-blue-100 py-2 px-3 text-center mb-2">
          <span className="font-bold text-blue-800 text-lg">
            {category}
          </span>
        </div>
        <div className="p-4 flex flex-col items-center justify-center h-48 w-full">
          <p className="text-gray-600">No tools available for this category.</p>
        </div>
      </div>
    );
  }

  // Take up to 6 tools from this category
  const displayTools = categoryTools.slice(0, 6);

  // Get the current tool to display
  const currentTool = displayTools[currentToolIndex % displayTools.length];

  // Only show navigation if we have multiple tools
  const hasMultipleTools = displayTools.length > 1;

  // Get image URL for the current tool
  const imageUrl = currentTool.screenshot_url && currentTool.screenshot_url.trim() !== ""
    ? `/screenshots/${currentTool.screenshot_url.split('/').pop()}`
    : "/default-screenshot.png";

  return (
    <div className="relative rounded-lg shadow-md bg-white flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden border border-gray-200">
      {/* Category header bar */}
      <div className="w-full bg-blue-100 py-2 px-3 text-center mb-2">
        <span className="font-bold text-blue-800 text-lg">
          {category}
        </span>
      </div>

      <div className="p-4 flex flex-col items-center w-full relative">
        {/* Navigation arrows - only show if multiple tools */}
        {hasMultipleTools && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentToolIndex(prev =>
                  prev === 0 ? displayTools.length - 1 : prev - 1
                );
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow-md hover:bg-gray-100"
              aria-label="Previous tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentToolIndex(prev =>
                  (prev + 1) % displayTools.length
                );
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow-md hover:bg-gray-100"
              aria-label="Next tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Tool image */}
        <div className="relative w-full pb-4 mb-6">
          <Image
            src={imageUrl}
            alt={`${currentTool.name} Screenshot`}
            width={1280}
            height={800}
            className="w-full h-auto rounded-md shadow-sm"
            unoptimized
          />

          {/* Tool counter (e.g., "1/3") - shows actual number */}
          {hasMultipleTools && (
            <div className="absolute bottom-6 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
              {currentToolIndex + 1}/{displayTools.length}
            </div>
          )}
        </div>

        {/* Tool name and link */}
        <h3 className="text-lg font-bold flex items-center">
          <a href={currentTool.source_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {currentTool.name}
          </a>
          <ExternalLink className="ml-2 w-4 h-4 text-gray-500" />
        </h3>

        {/* Tool description */}
        <p className="text-gray-600 text-center mt-2">{currentTool.short_description}</p>

        {/* Pagination dots - only for actual tools */}
        {hasMultipleTools && (
          <div className="flex justify-center mt-3 space-x-1">
            {displayTools.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentToolIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full ${
                  currentToolIndex === index ? 'bg-blue-500' : 'bg-gray-300'
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

// Enterprise Tool Card Component
const EnterpriseToolCard = ({ tool }) => {
  // Get image URL for the tool
  const imageUrl = tool.screenshot_url && tool.screenshot_url.trim() !== ""
    ? tool.screenshot_url
    : "/default-screenshot.png";

  return (
    <div className="relative rounded-lg shadow-md bg-white flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden border border-gray-200">
      {tool.certified && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-yellow-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
        </div>
      )}

      <div className="p-4 flex flex-col items-center w-full">
        {/* Tool image */}
        <div className="relative w-full pb-4 mb-6">
          <Image
            src={imageUrl}
            alt={`${tool.name} Screenshot`}
            width={1280}
            height={800}
            className="w-full h-auto rounded-md shadow-sm"
            unoptimized
          />
        </div>

        {/* Tool name and link */}
        <h3 className="text-lg font-bold flex items-center">
          <a href={tool.source_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {tool.name}
          </a>
          <ExternalLink className="ml-2 w-4 h-4 text-gray-500" />
        </h3>

        {/* Sector badge */}
        {tool.sector && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
            {tool.sector}
          </span>
        )}

        {/* Tool description */}
        <p className="text-gray-600 text-center mt-2">{tool.short_description}</p>
      </div>
    </div>
  );
};

// Categories instead of sources
const CATEGORIES = [
  { name: "All Categories", id: "" },
  { name: "Fan Intelligence", id: "Fan Intelligence", mobileName: "Fan Intel" },
  { name: "Advertising & Media", id: "Advertising & Media", mobileName: "Ad & Media" },
  { name: "Creative & Personalization", id: "Creative & Personalization", mobileName: "Creative" },
  { name: "Sponsorship & Revenue Growth", id: "Sponsorship & Revenue Growth", mobileName: "Revenue" },
  { name: "Measurement & Analytics", id: "Measurement & Analytics", mobileName: "Analytics" }
];

const FILTERS = [
  { name: "Personal Productivity", id: "personal" },
  { name: "Enterprise Solutions", id: "enterprise" },
];

const DEMO_CATEGORIES = [
  "Foundational AI",
  "Writing & Editing",
  "Meeting Assistants",
  "Deck Automation",
  "Content Creation",
  "Research & Analysis",
  "Task & Workflow",
  "Voice & Audio"
];

// Sponsor logos for the carousel - matching SIL website style
const SPONSORS = [
  { id: 1, name: "ClientLogo 1", logoUrl: "/logos/ClientLogo.jpg" },
  { id: 2, name: "ClientLogo 2", logoUrl: "/logos/ClientLogo_2.jpg" },
  { id: 3, name: "ClientLogo 3", logoUrl: "/logos/ClientLogo_3.jpg" },
  { id: 4, name: "ClientLogo 4", logoUrl: "/logos/ClientLogo_4.jpg" },
  { id: 6, name: "ClientLogo 6", logoUrl: "/logos/ClientLogo_6.jpg" },
  { id: 7, name: "ClientLogo 7", logoUrl: "/logos/ClientLogo_7.jpg" },
  { id: 8, name: "ClientLogo 8", logoUrl: "/logos/ClientLogo_8.jpg" },
  { id: 9, name: "ClientLogo 9", logoUrl: "/logos/ClientLogo_9.jpg" },
  { id: 10, name: "ClientLogo 10", logoUrl: "/logos/ClientLogo_10.jpg" },
  { id: 11, name: "ClientLogo 11", logoUrl: "/logos/ClientLogo_11.jpg" },
  { id: 12, name: "ClientLogo 12", logoUrl: "/logos/ClientLogo_12.jpg" },
  { id: 13, name: "ClientLogo 13", logoUrl: "/logos/ClientLogo_13.jpg" },
  { id: 14, name: "ClientLogo 14", logoUrl: "/logos/ClientLogo_14.jpg" },
  { id: 15, name: "ClientLogo 15", logoUrl: "/logos/ClientLogo_15.jpg" }
  // Add more logo references as needed - adjust filenames to match your actual files
];

const SponsorCarousel = () => {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: "#111822" }}>
      <style jsx>{`
        .logo-slider {
          padding: 0px 0 0px 0;
          overflow: hidden;
          width: 100%;
          height: 100px;
          white-space: nowrap;
        }
        
        .logo-slide-track {
          display: flex;
          gap: 1.5em;
          align-items: center;
          flex-direction: row;
          width: fit-content; /* Important for seamless looping */
          animation: scroll 20s linear infinite;
        }
        
        .logo-slide img {
          max-width: 100px;
          height: auto;
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.75em)); } /* Account for gap in calculation */
        }
        
        @media screen and (max-width: 768px) {
          .logo-slide img {
            max-width: 80px;
          }
        }
      `}</style>

      <div className="logo-slider">
        <div className="logo-slide-track">
          {/* First set of logos */}
          <div className="logo-slide">
            <img src="/logos/ClientLogo.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_1.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_2.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_3.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_4.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_6.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_7.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_8.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_9.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_10.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_11.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_12.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_13.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_14.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_15.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_16.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_17.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_18.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_19.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_20.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_21.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_22.jpg" alt="Logo" />
          </div>

          {/* Duplicate set for continuous loop - must be exact copy */}
          <div className="logo-slide">
            <img src="/logos/ClientLogo.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_1.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_2.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_3.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_4.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_6.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_7.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_8.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_9.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_10.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_11.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_12.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_13.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_14.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_15.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_16.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_17.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_18.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_19.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_20.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_21.jpg" alt="Logo" />
          </div>
          <div className="logo-slide">
            <img src="/logos/ClientLogo_22.jpg" alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Full-Screen Sponsor Carousel Modal - Full width, edge-to-edge with slower speed
const FullScreenSponsorCarousel = ({ isOpen, onClose }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Triple the sponsors array to ensure we have enough for any screen size
  const duplicatedSponsors = [...SPONSORS, ...SPONSORS, ...SPONSORS];

  // Measure the content width once mounted
  useEffect(() => {
    if (!isOpen) return;

    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth / 3);
    }

    const handleResize = () => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.scrollWidth / 3);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !contentWidth) return;

    // Animation function for smooth continuous scrolling
    let animationFrameId;
    let lastTimestamp = 0;
    const scrollSpeed = 0.25; // pixels per millisecond - slower for fullscreen

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Update scroll position
      setScrollPosition((prevPosition) => {
        let newPosition = prevPosition + scrollSpeed * elapsed;

        // Reset position when we've scrolled through the first set of sponsors
        if (newPosition >= contentWidth) {
          newPosition = 0;
        }

        return newPosition;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, contentWidth]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-blue-400 transition z-10"
      >
        <X size={32} />
      </button>

      <div className="text-center mb-12">
        <h2 className={`${inter.className} text-3xl font-bold text-white mb-2`}>
          Our Partners
        </h2>
        <p className="text-blue-400">
          Powering sports innovation together
        </p>
      </div>

      <div ref={containerRef} className="w-full overflow-hidden">
        <div
          ref={contentRef}
          className="flex items-center py-12"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
            whiteSpace: 'nowrap'
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="mx-12 inline-block"
            >
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={180}
                height={100}
                className="h-20 md:h-24 w-auto object-contain filter brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [tools, setTools] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("personal");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showNewsletter, setShowNewsletter] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSponsorCarousel, setShowSponsorCarousel] = useState(false);

  // Ref for the dropdown to detect clicks outside
  const dropdownRef = useRef(null);
  // Ref for header to match mobile menu height exactly
  const headerRef = useRef(null);
  // Ref for the fixed newsletter section
  const fixedNewsletterRef = useRef(null);

  // Add check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Only use sector filtering for Enterprise view
    const sectorParam = selectedFilter === 'enterprise' ? selectedCategory : '';

    // Changed from API_BASE_URL to relative path
    fetch(`/api/tools?sector=${sectorParam}&type=${selectedFilter}`)
      .then((response) => response.json())
      .then((data) => {
        // Always use a reasonable number of tools for consistency
        const processedTools = data;

        // Randomly certify one tool if desired
        if (processedTools.length > 0) {
          const certifiedIndex = Math.floor(Math.random() * processedTools.length);
          processedTools[certifiedIndex].certified = true;
        }

        setTools(processedTools);
        setCurrentSlide(0); // Reset carousel position when tools change
      })
      .catch((error) => console.error("Error fetching tools:", error));
  }, [selectedCategory, selectedFilter]);

  // Then, update the scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      // Check if the fixed newsletter is in view
      const fixedNewsletter = fixedNewsletterRef.current;
      let fixedNewsletterInView = false;

      if (fixedNewsletter) {
        const rect = fixedNewsletter.getBoundingClientRect();
        fixedNewsletterInView = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );
      }

      // Hide floating newsletter when at the bottom OR when fixed newsletter is in view
      if (scrollPosition >= pageHeight - 50 || fixedNewsletterInView) {
        setShowNewsletter(false);
      } else {
        setShowNewsletter(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.error ? data.error : "Thank you for subscribing!");

      if (!data.error) {
        setEmail("");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("Failed to subscribe. Please try again later.");
    }
  };

  // Functions to handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === tools.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? tools.length - 1 : prev - 1));
  };

  // Find the name of currently selected category
  const getSelectedCategoryName = () => {
    const category = CATEGORIES.find(c => c.id === selectedCategory);
    return category ? (isMobile ? category.mobileName || category.name : category.name) : "All Categories";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center relative">
      {/* Header Section with Sports Innovation Lab-inspired styling */}
      <header
        ref={headerRef}
        className="relative w-full text-white shadow-lg px-4 pt-1 pb-8 md:pt-2 md:pb-16"  // Reduced pt-2 to pt-1
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
            backgroundImage: "url('/SIL_bg.jpg')", // Using the SIL background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)',
            zIndex: 0
          }}
        ></div>

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
        ></div>

        {/* Content container - all content must be above the background layers */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          {/* Top: Logo + Hamburger + Nav */}
          <div className="flex items-center justify-between w-full mb-6 md:mb-8">
          {/* Left: Combined Logos */}
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="flex items-center space-x-3 ml-5">
              <a href="https://www.twinbrain.ai" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/logo_transparent.png"
                  alt="TwinBrain Logo"
                  width={isMobile ? 80 : 160}
                  height={isMobile ? 40 : 80}
                />
              </a>
              <span className="text-white font-bold mr-10">×</span>
              <a href="https://www.sportsilab.com" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/sil-logo.png"
                  alt="Sports Innovation Lab Logo"
                  width={isMobile ? 90 : 140}
                  height={isMobile ? 40 : 60}
                />
              </a>
            </div>
          </div>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex gap-6 text-sm sm:text-base text-white font-semibold mr-15">
              <a href="https://www.sportsilab.com/" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Sports Innovation Lab</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">AI Playbook</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">AI Lumascape</a>
            </nav>

            {/* Mobile Hamburger */}
            <div className="sm:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Modern Styled Title Section with Reduced Padding */}
          <div className="text-center mt-4 pb-8 md:pb-12">
            <h1 className={`${inter.className} text-3xl sm:text-5xl md:text-6xl leading-tight mb-3 tracking-tight`}>
              <span className="font-normal text-white">Sports</span>
              <span className="font-bold text-white">Innovation</span>
              <span className="font-normal text-white">Lab</span>
              <span className="font-bold text-yellow-300">AI</span>
            </h1>
            <p className={`${poppins.className} hidden sm:block text-lg sm:text-xl md:text-2xl mt-2 font-light`}>
              Discover the best AI tools for sports professionals
            </p>
          </div>
        </div>

        {/* Mobile Dropdown - The menu needs to have the same styling for consistency */}
        {menuOpen && (
          <div
            className="absolute top-0 left-0 right-0 text-white z-40 px-4 shadow-md border-b border-blue-500 overflow-y-auto"
            style={{
              height: headerRef.current ? `${headerRef.current.offsetHeight}px` : '100%',
              backgroundImage: "url('/SIL_bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%)'
            }}
          >
            {/* Dark overlay for mobile menu */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 0
              }}
            ></div>

            {/* Mobile menu content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Top Row: Logo and Close Button */}
              <div className="flex items-center justify-between pt-4 pb-2">
                <div className="flex items-center space-x-2">
                  <a href="https://www.twinbrain.ai" target="_blank" rel="noopener noreferrer">
                    <Image src="/logo_transparent.png" alt="TwinBrain Logo" width={50} height={25} />
                  </a>
                  <span className="text-white">×</span>
                  <a href="https://www.sportsilab.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/sil-logo.png" alt="Sports Innovation Lab Logo" width={60} height={25} />
                  </a>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-200 hover:text-white text-2xl font-light"
                >
                  ×
                </button>
              </div>

              {/* Nav Links Container with improved spacing */}
              <div className="flex flex-col items-center space-y-4 py-4 mt-2 pb-12">
                <h1 className={`${inter.className} text-xl font-semibold tracking-tight mb-6`}>SportsTechAI</h1>
                <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-center w-full max-w-xs">
                  <a href="https://www.sportsilab.com/" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="hover:underline text-base font-medium">Sports Innovation Lab</a>
                  <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false);}} className="hover:underline text-base font-medium">AI Playbook</a>
                  <a href="#fixed-newsletter" onClick={() => setMenuOpen(false)} className="hover:underline text-base font-medium">Newsletter</a>
                  <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false);}} className="hover:underline text-base font-medium">AI Lumascape</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sponsor Carousel Section */}
      <SponsorCarousel />

      {/* Full-screen sponsor carousel modal */}
      {showSponsorCarousel && (
        <FullScreenSponsorCarousel
          isOpen={showSponsorCarousel}
          onClose={() => setShowSponsorCarousel(false)}
        />
      )}

      {/* Personal/Enterprise Toggle */}
      <section className="p-4 flex justify-center mt-10">
        <div className="inline-flex rounded-md shadow-sm">
          {FILTERS.map((filter, index) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`
                px-6 py-3 text-lg font-bold
                ${index === 0 ? "rounded-l-lg" : ""}
                ${index === FILTERS.length - 1 ? "rounded-r-lg" : ""}
                ${selectedFilter === filter.id 
                  ? "bg-blue-600 text-white z-10" 
                  : "bg-white text-gray-900 hover:bg-gray-300"}
                border border-gray-300
                ${index > 0 && "-ml-px"}
                transition
              `}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </section>

      {/* Enterprise Sector Selection - Only visible for enterprise mode */}
      <section className="p-4 pt-8 flex justify-center bg-gray-100 mb-5">
        <div className={`inline-flex flex-wrap rounded-md shadow-sm ${selectedFilter === 'enterprise' ? '' : 'opacity-50 pointer-events-none'}`}>
          {CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
              }}
              className={`
                px-6 py-3 text-md font-bold
                border border-gray-300
                ${index === 0 ? "rounded-l-lg" : ""}
                ${index === CATEGORIES.length - 1 ? "rounded-r-lg" : ""}
                ${selectedCategory === category.id 
                  ? "bg-blue-600 text-white z-10" 
                  : "bg-gray-150 text-gray-900 hover:bg-gray-300"}
                ${index > 0 && "-ml-px"}
                transition
                whitespace-nowrap
              `}
            >
              {isMobile && category.mobileName ? category.mobileName : category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="p-6 w-full">
        {isMobile ? (
          // Mobile Carousel View
          <div className="relative w-full">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
              aria-label="Previous tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Carousel Item */}
            {tools.length > 0 && (
              <div className="w-full flex justify-center px-8">
                <div
                  className={`w-full p-4 border rounded-lg shadow-lg bg-white flex flex-col items-center text-center ${tools[currentSlide]?.certified ? "border-4 border-yellow-500" : ""}`}
                >
                  {tools[currentSlide]?.certified && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-yellow-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
                    </div>
                  )}
                  <img
                    src={tools[currentSlide]?.screenshot_url || "/default-screenshot.png"}
                    alt={`${tools[currentSlide]?.name} Screenshot`}
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <h3 className={`${inter.className} text-lg font-bold flex items-center justify-center`}>
                    <a href={tools[currentSlide]?.source_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {tools[currentSlide]?.name}
                    </a>
                    <ExternalLink className="ml-2 w-4 h-4 text-gray-500" />
                  </h3>

                  {selectedFilter === 'personal' ? (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
                      {tools[currentSlide]?.category || DEMO_CATEGORIES[currentSlide % DEMO_CATEGORIES.length]}
                    </span>
                  ) : (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-2">
                      {tools[currentSlide]?.sector || ""}
                    </span>
                  )}

                  <p className="text-gray-600 text-center">{tools[currentSlide]?.short_description}</p>
                </div>
              </div>
            )}

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
              aria-label="Next tool"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {tools.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Desktop View - Different layouts based on filter
          selectedFilter === 'personal' ? (
            // Personal mode: Category-based grid
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {DEMO_CATEGORIES.map((demoCategory, categoryIndex) => (
                <CategoryCard
                  key={demoCategory}
                  category={demoCategory}
                  tools={tools}
                  categoryIndex={categoryIndex}
                  demoCategories={DEMO_CATEGORIES}
                />
              ))}
            </div>
          ) : (
            // Enterprise mode: Simple grid of tools filtered by sector
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <EnterpriseToolCard key={index} tool={tool} />
              ))}
            </div>
          )
        )}
      </section>

      {/* Fixed Newsletter Section */}
      <section id="fixed-newsletter" ref={fixedNewsletterRef} className="w-full py-10 flex flex-col items-center shadow-md mt-10 px-4 sm:px-0 relative overflow-hidden">
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/Logo_BG.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        ></div>

        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between relative z-10 mt-20 mb-20">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 text-center md:text-left text-white">
            <h2 className={`${inter.className} text-2xl md:text-3xl font-bold`}>
              Get the SIL AI Playbook!
            </h2>
            <p className="mt-2 text-lg">
              <span className="font-semibold">Join industry leaders</span> discovering game-changing AI tools.
            </p>
            <p className="mt-1 text-sm text-yellow-200 font-medium">
              Curated by Sports Innovation Lab & TwinBrain AI
            </p>
          </div>

          <div className="md:w-1/2 w-full">
            <form className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-auto flex-grow text-base shadow-md"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap"
              >
                Request Now
              </button>
            </form>
            {message && (
              <p className="text-lg mt-2 font-medium text-center sm:text-left text-white">{message}</p>
            )}
          </div>
        </div>
      </section>


    {/*/!* Floating Newsletter Section *!/*/}
    {/*{showNewsletter && (*/}
    {/*  <section*/}
    {/*    className="hidden sm:block fixed bottom-0 w-full text-white py-6 shadow-xl z-50 overflow-hidden"*/}
    {/*    style={{*/}
    {/*      animation: 'slideUp 0.5s ease-out',*/}
    {/*    }}*/}
    {/*  >*/}
    {/*    <div*/}
    {/*      style={{*/}
    {/*        position: 'absolute',*/}
    {/*        top: 0,*/}
    {/*        left: 0,*/}
    {/*        right: 0,*/}
    {/*        bottom: 0,*/}
    {/*        backgroundImage: "url('/Logo_BG.jpg')",*/}
    {/*        backgroundSize: 'cover',*/}
    {/*        backgroundPosition: 'center',*/}
    {/*        zIndex: 0*/}
    {/*      }}*/}
    {/*    ></div>*/}

    {/*    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">*/}
    {/*      <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8">*/}
    {/*        <h2 className={`${inter.className} text-2xl md:text-3xl font-bold`}>Get the SIL AI playbook!</h2>*/}
    {/*        <p className="mt-2 text-lg">*/}
    {/*          <span className="font-semibold">Join industry leaders</span> discovering game-changing AI tools.*/}
    {/*        </p>*/}
    {/*        <p className="mt-1 text-sm text-yellow-200 font-medium">*/}
    {/*          Curated by Sports Innovation Lab & TwinBrain AI*/}
    {/*        </p>*/}
    {/*      </div>*/}

    {/*      <div className="md:w-1/2">*/}
    {/*        <form className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2" onSubmit={handleSubscribe}>*/}
    {/*          <input*/}
    {/*            type="email"*/}
    {/*            placeholder="Your email address"*/}
    {/*            value={email}*/}
    {/*            onChange={(e) => setEmail(e.target.value)}*/}
    {/*            className="px-6 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-auto flex-grow text-base shadow-md"*/}
    {/*            required*/}
    {/*          />*/}
    {/*          <button*/}
    {/*            type="submit"*/}
    {/*            className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap"*/}
    {/*            style={{*/}
    {/*              animation: 'pulse 2s infinite',*/}
    {/*            }}*/}
    {/*          >*/}
    {/*            Request Now*/}
    {/*          </button>*/}
    {/*        </form>*/}
    {/*        {message && (*/}
    {/*          <p className="text-lg mt-2 font-medium text-center sm:text-left text-white">{message}</p>*/}
    {/*        )}*/}
    {/*      </div>*/}
    {/*    </div>*/}

    {/*    /!* Close button *!/*/}
    {/*    <button*/}
    {/*      onClick={() => setShowNewsletter(false)}*/}
    {/*      className="absolute top-4 right-6 text-white hover:text-yellow-200 transition z-20"*/}
    {/*      aria-label="Close newsletter"*/}
    {/*    >*/}
    {/*      <X size={28} />*/}
    {/*    </button>*/}
    {/*  </section>*/}
    {/*)}*/}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7);
          }
          
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 204, 0, 0);
          }
          
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 204, 0, 0);
          }
        }
      `}</style>

      {/* YouTube Videos Section */}
      <div
        className="w-full flex flex-col items-center py-8 relative border-b-0"
        style={{
          backgroundImage: "url('/BGpattern05.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* YouTube Header */}
        <div className="text-center mb-6 px-4 flex flex-col items-center mt-15 mb-20">
          <a
            href="https://www.youtube.com/@sportsinnovationlab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 mb-2 hover:opacity-80 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="red"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.246 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            <h2 className={`${inter.className} text-2xl font-semibold text-gray-100`}>
              Follow Sports Innovation Lab on YouTube
            </h2>
          </a>
        </div>

        {/* Videos */}
        <section className="w-full flex flex-wrap justify-center gap-6 px-4 mb-20">
          <div className="w-full sm:w-4/5 aspect-video max-w-[900px]">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/ccrj9qymiUs"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="w-full sm:w-4/5 aspect-video max-w-[900px]">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/NxOyVYW_8Qs"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-500 text-white py-8 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-8">
          <a href="https://www.twinbrain.ai" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
            <Image src="/logo.png" alt="TwinBrain Logo" width={100} height={50} />
          </a>
          <span className="text-gray-300 font-bold text-2xl">×</span>
          <a href="https://www.sportsinnovationlab.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
            <Image src="/sil-logo.png" alt="Sports Innovation Lab Logo" width={120} height={50} />
          </a>
        </div>
        <p className="text-xs text-gray-300">
          &copy; {new Date().getFullYear()} | A collaboration between TwinBrain AI & Sports Innovation Lab
        </p>
      </footer>
      <CollapsibleChatbot />
    </div>
  );
}