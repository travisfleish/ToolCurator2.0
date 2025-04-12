'use client';

import React from 'react';

const MobileDescriptionSection = ({ isMobile }) => {
  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <div className="px-6 pt-10 pb-6 text-center relative">
      {/* Clean, modern design with minimal elements */}
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
        AI <span className="text-blue-600">Advantage</span> Resources
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-0 font-normal">
        Brought to you by <span className="font-semibold text-black">Sports Innovation Lab</span>
      </p>
    </div>
  );
};

export default MobileDescriptionSection;