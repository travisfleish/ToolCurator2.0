'use client';

import React from 'react';

const YouTubeSection = () => {
  return (
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
          href="https://www.youtube.com/sportsinnovationlab"
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
          <h2 className="text-2xl font-semibold text-gray-100">
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
  );
};

export default YouTubeSection;