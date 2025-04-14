'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

  return (
    <section id="newsletter-section" className="w-full bg-blue-600 py-10 md:py-10 mt-10 relative overflow-hidden">
      {/* Background pattern - subtle dots */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Founder image - positioned at the bottom left with responsive scaling */}
      <div className="absolute bottom-0 left-0 h-auto w-1/4 sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/4 z-10">
        <Image
          src="/founder.png"
          alt="Travis Fleisher, Founder"
          width={400}
          height={600}
          className="h-auto w-full object-contain object-bottom"
          priority
        />
      </div>

      {/* Main content - centered with padding to avoid image overlap */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center">
          {/* 1. Title at the top */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 mt-4">
            Get AI Tools in Your Inbox! 🚀
          </h2>

          {/* 2. Input form */}
          <div className="max-w-xl mx-auto mb-8">
            <form
              className="flex flex-col sm:flex-row items-center gap-2"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg text-gray-900 border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:flex-grow text-base shadow-md"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="px-4 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md w-full sm:w-auto whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Get Weekly Tools"}
              </button>
            </form>

            {message && (
              <p className={`text-sm mt-2 font-medium text-center ${isSuccess ? 'text-green-300' : 'text-white'}`}>
                {message}
              </p>
            )}
          </div>

          {/* 3. Stay ahead text */}
          <div className="text-white mb-8">
            <p className="text-base md:text-lg mx-auto">
              Stay up-to-date in this rapidly evolving field with our weekly newsletter.
            </p>
          </div>

          {/* 4. Quote at the bottom - ensures it doesn't overlap with image */}
          <div className="max-w-xl mx-auto pl-0 sm:pl-12 md:pl-20 lg:pl-0">
            <div className="text-white/90 text-base md:text-lg font-semibold">
              &quot;I&apos;m not a technical person by background, just someone deeply curious about AI. But the landscape felt overwhelming. Thousands of tools. Constantly changing. I built ToolCurator because I wanted something simple, valuable, and curated. A guide for people like me who just want to get started.&quot;
            </div>
            <div className="text-white/80 italic text-xl mt-8">
              Travis Fleisher, Founder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;