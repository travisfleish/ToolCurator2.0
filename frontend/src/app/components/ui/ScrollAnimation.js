'use client';

import React, { useEffect, useRef, useState, Children, cloneElement, isValidElement } from 'react';

/**
 * Mobile-optimized ScrollAnimation component
 * Significantly reduces animation complexity on mobile devices
 */
const ScrollAnimation = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = '',
  staggerChildren = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const elementRef = useRef(null);

  // Detect mobile once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  useEffect(() => {
    // Skip animation if there's no window (during SSR) or on mobile
    if (typeof window === 'undefined') return;

    // On mobile, either show content immediately or use simplified animations
    if (isMobile) {
      // Option 1: Show content immediately with no animations
      setIsVisible(true);
      return;

      // Option 2: Use simpler intersection observer with fewer options
      // Uncomment this and comment the setIsVisible(true) above if you want
      // minimal animations on mobile instead of none
      /*
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 } // Use a simple threshold only
      );

      const currentRef = elementRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
      */
    }

    // Full animations for desktop
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, isMobile]);

  // Animation styles based on device and visibility
  const getAnimationStyle = () => {
    // On mobile, use minimal or no animation styles
    if (isMobile) {
      return { opacity: 1, transform: 'none' };
    }

    // Desktop animation styles
    const baseStyle = {
      opacity: 0,
      transform: 'none',
      // Fixed: Combined transition with delay into a single property
      transition: `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
    };

    const visibleStyle = {
      opacity: 1,
      transform: 'none',
      // Fixed: Combined transition with delay into a single property
      transition: `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
    };

    // Initial styles based on animation type for desktop
    switch (animation) {
      case 'fade-up':
        baseStyle.transform = 'translateY(30px)';
        break;
      case 'fade-down':
        baseStyle.transform = 'translateY(-30px)';
        break;
      case 'fade-in':
        // Just opacity change, no transform needed
        break;
      case 'slide-in-left':
        baseStyle.transform = 'translateX(-50px)';
        break;
      case 'slide-in-right':
        baseStyle.transform = 'translateX(50px)';
        break;
      case 'scale-up':
        baseStyle.transform = 'scale(0.9)';
        break;
      case 'scale-down':
        baseStyle.transform = 'scale(1.1)';
        break;
      default:
        baseStyle.transform = 'translateY(20px)';
    }

    return isVisible ? visibleStyle : baseStyle;
  };

  // Simplified child animation approach
  const animateChildren = () => {
    // For mobile, don't apply staggered animations to children
    if (isMobile) {
      return children;
    }

    return Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;

      // Determine child animation delay if staggering is enabled
      const childDelay = staggerChildren ? index * 100 : 0;
      const totalDelay = delay + childDelay;

      // Merge existing styles with animation styles
      const childStyle = {
        ...(child.props.style || {}),
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : (
          animation === 'fade-up' ? 'translateY(30px)' :
          animation === 'fade-down' ? 'translateY(-30px)' :
          animation === 'slide-in-left' ? 'translateX(-50px)' :
          animation === 'slide-in-right' ? 'translateX(50px)' :
          animation === 'scale-up' ? 'scale(0.9)' :
          animation === 'scale-down' ? 'scale(1.1)' :
          'translateY(20px)'
        ),
        // Fixed: Combined transition with delay into a single property
        transition: `transform ${duration}ms ease-out ${totalDelay}ms, opacity ${duration}ms ease-out ${totalDelay}ms`
      };

      // Clone the child with additional animation styles
      return cloneElement(child, {
        style: childStyle,
        className: `${child.props.className || ''} ${staggerChildren ? 'stagger-children' : ''}`
      });
    });
  };

  return (
    <div
      ref={elementRef}
      className={`w-full ${className}`}
      style={isMobile ? { opacity: 1, width: '100%' } : {...getAnimationStyle(), width: '100%'}}
      {...props}
    >
      {isMobile ? children : animateChildren()}
    </div>
  );
};

export default ScrollAnimation;