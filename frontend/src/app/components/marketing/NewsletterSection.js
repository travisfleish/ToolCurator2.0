'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useNewsletterForm from '../../hooks/useNewsletterForm';

const NewsletterSection = ({ variant = "fixed", onClose }) => {
  const isFixed = variant === "fixed";
  const isFloating = variant === "floating";

  const [isMobile, setIsMobile] = useState(false);

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
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="newsletter-section" className="w-full bg-[#e86f0c] pt-16 pb-16 mt-10 relative overflow-hidden">

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Founder Image - only visible on lg and xl */}
      <div className="hidden md:block absolute bottom-0 left-20 w-48 md:w-40 lg:w-40 xl:w-60 z-10">
        <Image
          src="/founder.png"
          alt="Travis Fleisher, Founder"
          width={600}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />
      </div>


      {/* Main content */}
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="text-center">

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 mt-4">
            Get the Best New AI Tools in Your Inbox, Every Week
          </h2>

          {/* Input form */}
          <div className="max-w-xl mx-auto mb-2">
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
                className="px-4 py-3 bg-gray-400 text-white font-bold rounded-lg hover:bg-[#7a0707] transition shadow-md w-full sm:w-auto whitespace-nowrap"
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

          {/* Quote block */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl text-left mt-14 mb-6">
              <p className="text-white/90 text-base md:text-lg font-semibold text-center">
                “Hi, I’m Travis. I built ToolCurator to solve a problem I had: there are tons of AI tools, but no easy way to find the good ones. I track trending tools, test them myself, and share only what’s actually useful.
              </p>
              <p className="text-white/90 text-base md:text-lg font-semibold mt-4 text-center">
                Each week, I send out a newsletter with handpicked tools, tutorials, and reviews—so you can use AI to work smarter, not harder.”
              </p>
              <p className="text-white/80 text-sm mt-3 text-center">
                — Travis Fleisher, Founder
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
