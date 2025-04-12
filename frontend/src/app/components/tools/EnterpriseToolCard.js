import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

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

      {/* Tool image - Full width with no padding/margins on top or sides */}
      <div className="w-full">
        <Image
          src={imageUrl}
          alt={`${tool.name} Screenshot`}
          width={1280}
          height={800}
          className="w-full h-auto"
          unoptimized
        />
      </div>

      {/* Tool info section */}
      <div className="p-4 flex flex-col items-center w-full">
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

export default EnterpriseToolCard;