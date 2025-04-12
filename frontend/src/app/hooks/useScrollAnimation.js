'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * A mobile-optimized hook that detects viewport visibility
 * with significantly reduced animation complexity on mobile devices
 */
const useScrollAnimation = ({
  animation = 'fade-up',
  threshold = 0.1,
  delay = 0,
  duration = 800,
  once = true
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const elementRef = useRef(null);

  // Detect mobile device once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);

      // Immediately make visible on mobile
      if (window.innerWidth < 768) {
        setIsVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    // Skip complex observer setup on mobile
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const currentRef = elementRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && (!once || !isVisible)) {
          setIsVisible(true);
        } else if (!entry.isIntersecting && !once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once, isVisible, isMobile]);

  // Generate simplified animation styles for mobile
  const getAnimationStyles = () => {
    // For mobile, return visible styles immediately
    if (isMobile) {
      return {
        opacity: 1,
        transform: 'none'
      };
    }

    // Desktop animation styles
    const styles = {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : '',
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    // Add transform based on animation type (when not visible)
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          styles.transform = 'translateY(30px)';
          break;
        case 'fade-down':
          styles.transform = 'translateY(-30px)';
          break;
        case 'slide-in-left':
          styles.transform = 'translateX(-50px)';
          break;
        case 'slide-in-right':
          styles.transform = 'translateX(50px)';
          break;
        case 'scale-up':
          styles.transform = 'scale(0.9)';
          break;
        case 'scale-down':
          styles.transform = 'scale(1.1)';
          break;
        // Default is just opacity change
      }
    }

    return styles;
  };

  // Create simplified className string for mobile
  const getAnimationClass = () => {
    if (isMobile) {
      return '';
    }

    const baseClass = 'animate-on-scroll';
    const typeClass = animation;
    const visibleClass = isVisible ? 'animate-visible' : '';
    const durationClass = `duration-${duration}`;
    const delayClass = delay > 0 ? `delay-${delay}` : '';

    return [baseClass, typeClass, visibleClass, durationClass, delayClass]
      .filter(Boolean)
      .join(' ');
  };

  return {
    ref: elementRef,
    isVisible: isMobile ? true : isVisible,
    style: getAnimationStyles(),
    className: getAnimationClass(),
    isMobile
  };
};

export default useScrollAnimation;