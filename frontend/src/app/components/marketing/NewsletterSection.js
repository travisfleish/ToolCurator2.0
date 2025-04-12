'use client';

import React, { useState, useEffect } from 'react';
import useNewsletterForm from '../../hooks/useNewsletterForm';

const NewsletterSection = ({ variant = "fixed", onClose }) => {
  // Different styles based on variant
  const isFixed = variant === "fixed";
  const isFloating = variant === "floating";

  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Use the newsletter form hook for all devices
  const {
    email,
    setEmail,
    message,
    isSubmitting,
    isSuccess,
    error,
    handleSubscribe
  } = useNewsletterForm();

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

  // Base wrapper classes and styles - significantly reduced padding for mobile
  const wrapperClasses = isFixed
    ? `w-full ${isMobile ? 'py-8' : 'py-40'} flex flex-col items-center shadow-md mt-10 px-4 sm:px-8 relative overflow-hidden`
    : "fixed bottom-0 w-full text-white py-16 shadow-xl z-50 overflow-hidden";

  const wrapperStyles = {
    position: isFixed ? 'relative' : 'fixed',
    animation: isFloating ? 'slideUp 0.5s ease-out' : undefined
  };

  // Background div styles
  const bgStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url('/Logo_BG.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0
  };

  // Create a unique ID for the newsletter section
  const sectionId = isFixed ? "fixed-newsletter" : "floating-newsletter";

  // Heading and subheading text sizes adjustments for mobile
  const headingClass = isMobile
    ? "text-2xl mb-3 font-bold text-white" // Smaller title on mobile
    : "text-4xl md:text-5xl mb-10 font-bold text-white";

  const subtextClass = isMobile
    ? "text-sm font-medium text-center mb-2" // Smaller subtext on mobile
    : "text-lg md:text-xl font-semibold text-center";

  // Form input padding adjustments for mobile
  const inputClass = isMobile
    ? "px-3 py-2 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-auto flex-grow text-base shadow-md"
    : "px-6 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-auto flex-grow text-base shadow-md";

  const buttonClass = isMobile
    ? "px-3 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap"
    : "px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap";

  return (
    <section
      id={sectionId}
      className={wrapperClasses}
      style={wrapperStyles}
    >
      {/* Background */}
      <div style={bgStyles}></div>

      {/* Centered Header */}
      <div className="text-center mb-2 sm:mb-8 relative z-10">
        <h2 className={headingClass}>
           Don&apos;t Miss an AI Beat!
        </h2>
      </div>

      {/* Content container - reduced spacing for mobile */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center relative z-10 px-4 sm:px-8 lg:px-12">
        {/* Subtext - vertically aligned with form */}
        <div className="md:w-1/2 mb-3 md:mb-0 md:pr-6 text-white flex items-center text-center">
          <p className={subtextClass}>
            Sign up for more AI news, events, and resources from Sports Innovation Lab.
          </p>
        </div>

        {/* Right section - Form */}
        <div className="md:w-1/2 w-full">
          <form
            className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2'}`}
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={buttonClass}
              style={isFloating ? { animation: 'pulse 2s infinite' } : {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Request Now"}
            </button>
          </form>

          {message && (
            <p className={`text-sm sm:text-base mt-2 font-medium text-center sm:text-left ${isSuccess ? 'text-green-300' : 'text-white'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Close button (only for floating variant) */}
      {isFloating && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white hover:text-yellow-200 transition z-20"
          aria-label="Close newsletter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </section>
  );
};

export default NewsletterSection;