import React from 'react';
import { X } from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const MobileMenu = ({ isOpen, onClose, headerRef, navItems }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Menu container with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center pb-8">
        {/* Header with logo and close button exactly where hamburger was */}
        <div className="w-full flex items-center justify-between px-4 pt-4">
          <div className="flex-1">
            <Image
              src="/TwinBrain_White_Transparent.png"
              alt="TwinBrain AI Logo"
              width={120}
              height={40}
            />
          </div>
          <button onClick={onClose} className="text-white p-1 mt-8">
            <X size={24} />
          </button>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h2 className={`${inter.className} text-4xl font-bold text-white`}>
            <span className="font-normal">Tool</span>
            <span className="font-bold">Curator</span>
            <span className="font-bold text-yellow-300">.ai</span>
          </h2>
        </div>

        {/* Navigation Links with reduced spacing */}
        <div className="flex flex-col items-center w-full">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className="text-white text-lg py-1 hover:bg-white/10 w-full text-center"
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