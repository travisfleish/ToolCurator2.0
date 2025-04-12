'use client';

const { useState, useEffect } = require('react');

const useMediaQuery = (query = '(max-width: 768px)') => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Default to true if window exists and screen is narrow
    const checkInitialValue = () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth <= 768;
    };

    setMatches(checkInitialValue());

    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);

      // Initial check
      setMatches(media.matches);

      // Add listener for changes
      const listener = (e) => setMatches(e.matches);

      // Different browsers have different event models
      if (media.addEventListener) {
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
      } else {
        // Older browsers (IE/Edge)
        media.addListener(listener);
        return () => media.removeListener(listener);
      }
    }

    // Return empty function if window is not defined (SSR)
    return () => {};
  }, [query]);

  return matches;
};

module.exports = useMediaQuery;