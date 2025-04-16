'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBlogPosts } from '../../../lib/blog-util';

// Neural Network Background Animation - Updated to accept and check isMobile prop
const NeuralNetworkBackground = ({ isMobile }) => {
  // Skip rendering completely on mobile devices
  if (isMobile) {
    return null;
  }

  const canvasRef = useRef(null);
  const neuronsRef = useRef([]);
  const connectionsRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Calculate appropriate neuron count based on screen area
    const calculateNeuronCount = (width, height) => {
      const area = width * height;
      // Increase base density from 80 to 120 neurons for a 1920x1080 screen (2M pixels)
      const baseDensity = 120 / (1920 * 1080);
      // Scale with area, with increased limits (from 40-150 to 60-200)
      return Math.max(60, Math.min(200, Math.floor(area * baseDensity)));
    };

    // Function to update canvas dimensions and scale content
    const updateCanvasSize = () => {
      if (!canvas || !canvas.parentElement) return;

      const parentRect = canvas.parentElement.getBoundingClientRect();
      const previousWidth = canvas.width;
      const previousHeight = canvas.height;

      // Set to parent container size
      canvas.width = parentRect.width;
      canvas.height = parentRect.height;

      // If we already have neurons, reposition them
      if (neuronsRef.current.length > 0) {
        // Scale neuron positions to maintain relative positioning
        neuronsRef.current.forEach(neuron => {
          neuron.x = (neuron.x / previousWidth) * canvas.width;
          neuron.y = (neuron.y / previousHeight) * canvas.height;
        });

        // Recalculate connections based on new positions
        updateConnections();
      }
    };

    // Create neural network elements
    const initializeNetwork = () => {
      // Clear any existing elements
      neuronsRef.current = [];
      connectionsRef.current = [];

      // Calculate neuron count based on current canvas size
      const neuronCount = calculateNeuronCount(canvas.width, canvas.height);

      // Create neurons
      for (let i = 0; i < neuronCount; i++) {
        neuronsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          connections: [],
          pulseSpeed: Math.random() * 0.015 + 0.005,
          pulseState: Math.random() * Math.PI * 2,
          activationState: 0,
          activationThreshold: 0.7,
          activationDecay: 0.02,
          lastFired: 0,
          refractoryPeriod: 20 + Math.random() * 50,
        });
      }

      updateConnections();

      // Initialize random neurons to start firing
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * neuronsRef.current.length);
        neuronsRef.current[randomIndex].activationState = 1;
      }
    };

    // Create connections between neurons
    const updateConnections = () => {
      // Reset connections
      connectionsRef.current = [];

      // For each neuron
      for (let i = 0; i < neuronsRef.current.length; i++) {
        // Find distances to all other neurons
        const distances = [];
        for (let j = 0; j < neuronsRef.current.length; j++) {
          if (i !== j) {
            const dx = neuronsRef.current[i].x - neuronsRef.current[j].x;
            const dy = neuronsRef.current[i].y - neuronsRef.current[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            distances.push({ index: j, distance });
          }
        }

        // Sort by distance and connect to closest neurons
        distances.sort((a, b) => a.distance - b.distance);
        // Increase connection count range from (2-5) to (4-8)
        const connectionCount = Math.floor(Math.random() * 5) + 4;

        // Increase maximum connection distance based on canvas size (from 1/4 to 1/3)
        const maxDistance = canvas.width / 3;

        // Increase max connections per neuron from 10 to 15
        for (let k = 0; k < Math.min(connectionCount, distances.length, 15); k++) {
          if (distances[k].distance < maxDistance) {
            const connection = {
              from: i,
              to: distances[k].index,
              strength: Math.random() * 0.3 + 0.1,
              signalProgress: 0,
              signalActive: false,
              signalSpeed: Math.random() * 0.03 + 0.01,
              delay: Math.floor(Math.random() * 5)
            };

            connectionsRef.current.push(connection);
            neuronsRef.current[i].connections.push(connection);
          }
        }
      }
    };

    // Animation time tracker
    let time = 0;

    // Animation function
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 1;

      // Fade background slightly for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections
      connectionsRef.current.forEach(connection => {
        const neuronFrom = neuronsRef.current[connection.from];
        const neuronTo = neuronsRef.current[connection.to];

        // Draw connection line (axon)
        ctx.beginPath();
        ctx.moveTo(neuronFrom.x, neuronFrom.y);
        ctx.lineTo(neuronTo.x, neuronTo.y);
        ctx.strokeStyle = 'rgba(60, 80, 170, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Check if signal should be sent
        if (neuronFrom.activationState > 0.7 && !connection.signalActive &&
            (time - neuronFrom.lastFired) > connection.delay) {
          connection.signalActive = true;
          connection.signalProgress = 0;
        }

        // Update and draw signal if active
        if (connection.signalActive) {
          connection.signalProgress += connection.signalSpeed;

          if (connection.signalProgress >= 1) {
            // Signal reached destination, activate target neuron
            connection.signalActive = false;
            neuronTo.activationState += connection.strength;
            if (neuronTo.activationState > 1) neuronTo.activationState = 1;
          } else {
            // Draw signal pulse along axon
            const signalX = neuronFrom.x + (neuronTo.x - neuronFrom.x) * connection.signalProgress;
            const signalY = neuronFrom.y + (neuronTo.y - neuronFrom.y) * connection.signalProgress;

            // Signal pulse glow
            const gradient = ctx.createRadialGradient(
              signalX, signalY, 0,
              signalX, signalY, 6
            );
            gradient.addColorStop(0, 'rgba(130, 180, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(130, 180, 255, 0)');

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(signalX, signalY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Update and draw neurons
      neuronsRef.current.forEach((neuron, index) => {
        // Update pulse state
        neuron.pulseState += neuron.pulseSpeed;

        // Handle neuron activation and firing
        if (neuron.activationState > 0) {
          // Decay activation over time
          neuron.activationState -= neuron.activationDecay;
          if (neuron.activationState < 0) neuron.activationState = 0;

          // Check if neuron should fire
          if (neuron.activationState > neuron.activationThreshold &&
              (time - neuron.lastFired) > neuron.refractoryPeriod) {
            // Neuron fires!
            neuron.lastFired = time;

            // Create firing effect (bright flash)
            const firingGradient = ctx.createRadialGradient(
              neuron.x, neuron.y, 0,
              neuron.x, neuron.y, neuron.size * 5
            );
            firingGradient.addColorStop(0, 'rgba(220, 240, 255, 0.8)');
            firingGradient.addColorStop(0.5, 'rgba(120, 180, 255, 0.4)');
            firingGradient.addColorStop(1, 'rgba(70, 120, 255, 0)');

            ctx.beginPath();
            ctx.fillStyle = firingGradient;
            ctx.arc(neuron.x, neuron.y, neuron.size * 5, 0, Math.PI * 2);
            ctx.fill();

            // Sometimes randomly activate another neuron
            if (Math.random() < 0.2) {
              const randomNeuron = neuronsRef.current[Math.floor(Math.random() * neuronsRef.current.length)];
              randomNeuron.activationState = Math.min(randomNeuron.activationState + 0.5, 1);
            }
          }
        }

        // Draw neuron with pulsing effect
        const glowSize = neuron.size * (1 + 0.5 * Math.sin(neuron.pulseState));
        const activationColor = Math.floor(neuron.activationState * 200);

        // Cell body glow
        const gradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, glowSize * 3
        );
        gradient.addColorStop(0, `rgba(${50 + activationColor}, ${100 + activationColor}, 255, ${0.1 + neuron.activationState * 0.4})`);
        gradient.addColorStop(1, 'rgba(70, 120, 255, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(neuron.x, neuron.y, glowSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Cell body
        ctx.beginPath();
        ctx.fillStyle = `rgba(${100 + activationColor}, ${150 + activationColor}, 255, ${0.3 + neuron.activationState * 0.5})`;
        ctx.arc(neuron.x, neuron.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Randomly activate neurons more frequently to maintain higher activity
      // Changed from every 100 frames to every 60 frames
      if (time % 60 === 0) {
        // Activate 2 random neurons instead of just 1
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * neuronsRef.current.length);
          neuronsRef.current[randomIndex].activationState = 1;
        }
      }
    };

    // Use ResizeObserver for better responsiveness
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initial setup
    updateCanvasSize();
    initializeNetwork();
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-1"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
};

const BlogSection = () => {
  // State management remains the same
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  // Detect if we're on mobile
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

  // State management for blog section
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts(3);
        // Clean up the excerpt to remove author attribution and ensure URLs are absolute
        const cleanedPosts = posts.map(post => ({
          ...post,
          title: sanitizeText(post.title),
          excerpt: sanitizeText(removeAuthorFromExcerpt(post.excerpt, post.author)),
          // Ensure URL is absolute
          url: ensureAbsoluteUrl(post.url)
        }));
        setBlogs(cleanedPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Helper functions
  const sanitizeText = (text) => {
    if (!text) return '';
    return text.replace(/'/g, "'");
  };

  const ensureAbsoluteUrl = (url) => {
    if (!url) return 'https://www.twinbrain.ai/blog';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://www.twinbrain.ai${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const removeAuthorFromExcerpt = (excerpt, author) => {
    if (!excerpt || !author) return excerpt;
    let cleaned = excerpt.replace(new RegExp(`By:\\s*${author}`, 'i'), '');
    cleaned = cleaned.replace(/By:\s*[^.,;]+/i, '');
    cleaned = cleaned.replace(/\.\s*By:?\s*[^.,;]+\.?$/i, '.');
    return cleaned.trim();
  };

  // Carousel navigation functions
  const nextSlide = () => {
    if (blogs.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  const prevSlide = () => {
    if (blogs.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
  };

  // Touch controls for swipe gesture
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
  };

  return (
    <section id="blog-section" className="w-full py-20 text-white relative">
      {/* Modern black gradient background - behind everything */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, #000000, #0a0a18, #0a1020)',
          zIndex: 0
        }}
      />

      {/* Neural Network Animation Background - Only for non-mobile devices */}
      <NeuralNetworkBackground isMobile={isMobile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Adjusted padding: less above, more below */}
        <div className={`text-center ${isMobile ? 'pt-1 pb-4' : 'pb-6 my-8'}`}>
          <h2 className={`${isMobile ? "text-4xl font-bold" : "text-5xl"} flex items-center ${isMobile ? "justify-center" : "justify-center gap-3"}`}
              style={{
                textShadow: '0 0 15px rgba(100, 150, 255, 0.4)'
              }}>
              {isMobile ? (
                <div className="flex items-center gap-2">
                  AI Blog {' '}
                  <a href="https://www.twinbrain.ai" target="_blank" rel="noopener noreferrer" className="ml-1 flex items-center">
                    <span className="mx-1">by</span>
                    <Image
                      src="/TwinBrain_White_Transparent.png"
                      alt="TwinBrain Logo"
                      width={90}
                      height={30}
                      className="inline hover:opacity-80 transition-opacity duration-300"
                    />
                  </a>
                </div>
              ) : (
                <>
                  AI Blog - <a href="https://www.twinbrain.ai/blog" target="_blank" rel="noopener noreferrer" className="font-extrabold hover:text-blue-300 transition-colors duration-300">Neural Notes</a> by: {' '}
                  <a href="https://www.twinbrain.ai" target="_blank" rel="noopener noreferrer"
                    className="relative group">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                    <Image
                      src="/TwinBrain_White_Transparent.png"
                      alt="TwinBrain Logo"
                      width={200}
                      height={60}
                      className="inline relative z-10"
                    />
                  </a>
                </>
              )}
            </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-300">Loading latest blog posts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300">No blog posts available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Mobile Carousel View */}
            {isMobile ? (
              <div className="relative mx-auto max-w-md">
                {/* Navigation arrows - positioned higher */}
                {blogs.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/4 -translate-y-1/2 z-10 bg-black/80 p-2.5 rounded-full text-white hover:bg-black transition shadow-md"
                      aria-label="Previous blog"
                    >
                      <ChevronLeft size={26} />
                    </button>

                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/4 -translate-y-1/2 z-10 bg-black/80 p-2.5 rounded-full text-white hover:bg-black transition shadow-md"
                      aria-label="Next blog"
                    >
                      <ChevronRight size={26} />
                    </button>
                  </>
                )}

                {/* Carousel container */}
                <div
                  ref={carouselRef}
                  className="overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Blog post carousel */}
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {blogs.map((blog, index) => (
                      <div
                        key={blog.id || Math.random().toString(36).substring(2, 9)}
                        className="w-full flex-shrink-0 bg-[#0a1020]/80 backdrop-blur-md rounded-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(100,150,255,0.2)]"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(18, 26, 38, 0.85), rgba(10, 16, 32, 0.9))',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderImage: 'linear-gradient(to bottom, rgba(100, 150, 240, 0.3), rgba(70, 120, 255, 0.1)) 1'
                        }}
                      >
                        {/* Image container */}
                        <a
                          href={blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-60 bg-gray-900 relative block overflow-hidden"
                        >
                          {blog.imageUrl ? (
                            <img
                              src={blog.imageUrl}
                              alt={blog.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                                const placeholder = document.createElement('div');
                                placeholder.className = 'text-gray-500 text-center';
                                placeholder.innerText = 'Image unavailable';
                                e.target.parentNode.appendChild(placeholder);
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                <span className="text-gray-500">No image</span>
                              </div>
                            </div>
                          )}
                        </a>

                        <div className="p-6 flex-grow flex flex-col">
                          <div className="mb-2 flex items-center text-sm text-gray-400">
                            {blog.author && (
                              <span className="mr-2 text-sm">{blog.author}</span>
                            )}
                            {blog.date && (
                              <>
                                {blog.author && <span className="mr-2">•</span>}
                                <span className="text-sm">{blog.date}</span>
                              </>
                            )}
                          </div>

                          <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-300 transition-colors"
                          >
                            <h3 className="text-xl font-bold mb-4">{blog.title}</h3>
                          </a>

                          <p className="text-gray-300 mb-6 flex-grow text-sm line-clamp-3 leading-relaxed" style={{ lineHeight: '1.6' }}>{blog.excerpt}</p>

                          <div className="flex items-center justify-between mt-auto">
                            <a
                              href={blog.url}
                              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Read more <ArrowRight className="ml-2 h-4 w-4" />
                            </a>

                            {/* TwinBrain logo aligned with Read more - ENLARGED */}
                            <a
                              href="https://www.twinbrain.ai"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <Image
                                src="/TwinBrain_White_Transparent.png"
                                alt="TwinBrain Logo"
                                width={70}
                                height={35}
                                className="self-center"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination dots */}
                {blogs.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {blogs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          currentIndex === index ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        aria-label={`Go to blog ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Desktop View (original grid layout)
              <div className="grid grid-cols-1 gap-12 mx-auto max-w-3xl">
                {blogs.map((blog) => (
                  <div
                    key={blog.id || Math.random().toString(36).substring(2, 9)}
                    className="bg-[#0a1020]/80 backdrop-blur-md rounded-lg overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(100,150,255,0.2)]"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(18, 26, 38, 0.85), rgba(10, 16, 32, 0.9))',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderImage: 'linear-gradient(to bottom, rgba(100, 150, 240, 0.3), rgba(70, 120, 255, 0.1)) 1'
                    }}
                  >
                    {/* Much larger image area - now clickable */}
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-96 bg-gray-900 relative block overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                            const placeholder = document.createElement('div');
                            placeholder.className = 'text-gray-500 text-center';
                            placeholder.innerText = 'Image unavailable';
                            e.target.parentNode.appendChild(placeholder);
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        </div>
                      )}
                    </a>
                    <div className="p-10 flex-grow flex flex-col">
                      <div className="mb-4 flex items-center text-sm text-gray-400">
                        {blog.author && (
                          <span className="mr-2 text-base">{blog.author}</span>
                        )}
                        {blog.date && (
                          <>
                            {blog.author && <span className="mr-2">•</span>}
                            <span className="text-base">{blog.date}</span>
                          </>
                        )}
                      </div>
                      {/* Title is now a link */}
                      <a
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-300 transition-colors"
                      >
                        <h3 className="text-2xl font-bold mb-6">{blog.title}</h3>
                      </a>
                      <p className="text-gray-300 mb-8 flex-grow text-lg leading-relaxed" style={{ lineHeight: '1.7' }}>{blog.excerpt}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <a
                          href={blog.url}
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more <ArrowRight className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </a>

                        {/* TwinBrain logo aligned with Read more - ENLARGED */}
                        <a
                          href="https://www.twinbrain.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Image
                            src="/TwinBrain_White_Transparent.png"
                            alt="TwinBrain Logo"
                            width={120}
                            height={60}
                            className="self-center"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;