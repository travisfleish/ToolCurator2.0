import React from 'react';
import Image from 'next/image';

import { SPONSORS } from '../../utils/constants';

// Reusable logo rendering function
const LogoSlide = ({ logo }) => (
  <div className="logo-slide">
    <Image
      src={logo.logoUrl}
      alt={logo.name}
      width={100}
      height={50}
      className="max-w-[100px] h-auto"
      unoptimized
    />
  </div>
);

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
          width: fit-content;
          animation: scroll 20s linear infinite;
        }
        
        .logo-slide img {
          max-width: 100px;
          height: auto;
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.75em)); }
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
          {SPONSORS.map(logo => <LogoSlide key={logo.id} logo={logo} />)}

          {/* Duplicate set for continuous loop */}
          {SPONSORS.map(logo => <LogoSlide key={`duplicate-${logo.id}`} logo={logo} />)}
        </div>
      </div>
    </div>
  );
};

export default SponsorCarousel;