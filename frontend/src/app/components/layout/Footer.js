import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Footer = () => {
  // Router for navigation
  const router = useRouter();

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

  // Footer links that were moved from header
  const footerLinks = [
    {
      label: "Submit Tool",
      href: "/submit",
      onClick: (e) => {
        e.preventDefault();
        router.push('/submit');
      }
    },
    {
      label: "Advertise",
      href: "/advertise",
      onClick: (e) => {
        e.preventDefault();
        router.push('/advertise');
      }
    }
  ];

  return (
    <footer className="w-full bg-gray-800 text-white py-8 flex flex-col items-center">
      <div className="flex items-center justify-center space-x-4 mb-6">
        <a
          href="https://www.twinbrain.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <Image
            src="/TwinBrain_White_Transparent.png"
            alt="TwinBrain AI Logo"
            width={isMobile ? 70 : 160}
            height={isMobile ? 25 : 40}
            className="h-auto"
          />
        </a>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-6">
        {footerLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            onClick={link.onClick}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {link.label}
          </a>
        ))}

        {/* Additional footer links */}
        <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
          Privacy Policy
        </a>
        <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
          Terms of Service
        </a>
        <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
          Contact Us
        </a>
      </div>

      {/* Copyright */}
      <div className={copyrightClass}>
        &copy; {new Date().getFullYear()} ToolCurator.ai | Powered by TwinBrain.ai | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;