import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Footer = () => {
  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

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

  // Adjust text size based on device
  const copyrightClass = isMobile
    ? "text-[9px] text-gray-300 mt-1 px-4 text-center"
    : "text-xs text-gray-300 mt-2";

  return (
    <footer className="w-full bg-gray-500 text-white py-5 flex flex-col items-center space-y-2">
      <div className="flex items-center justify-center space-x-4 mt-3 mb-3">
        <a
          href="https://www.sportsinnovationlab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <Image
            src="/sil-logo.png"
            alt="Sports Innovation Lab Logo"
            width={isMobile ? 70 : 140}
            height={isMobile ? 25 : 60}
            className="h-auto"
          />
        </a>
      </div>
      <p className={copyrightClass}>
        &copy; {new Date().getFullYear()} | A collaboration between TwinBrain AI & Sports Innovation Lab
      </p>
    </footer>
  );
};

export default Footer;