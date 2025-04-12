import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Inter } from 'next/font/google';

// Configure font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const MobileMenu = ({
  isOpen,
  onClose,
  headerRef,
  navItems
}) => {
  if (!isOpen) return null;

  return React.createElement("div", {
    className: "absolute top-0 left-0 right-0 text-white z-40 px-4 shadow-md border-b border-blue-500 overflow-y-auto",
    style: {
      height: headerRef.current ? `${headerRef.current.offsetHeight}px` : '100%',
      backgroundImage: "url('/SIL_bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'grayscale(100%)'
    }
  }, [
    // Dark overlay
    React.createElement("div", {
      key: "overlay",
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 0
      }
    }),

    // Mobile menu content
    React.createElement("div", {
      key: "content",
      style: { position: 'relative', zIndex: 1 }
    }, [
      // Top Row: Logo and Close Button
      React.createElement("div", {
        key: "header",
        className: "flex items-center justify-between pt-4 pb-2"
      }, [
        React.createElement("div", {
          key: "logos",
          className: "flex items-center space-x-2"
        }, [
          React.createElement("a", {
            key: "twinbrain",
            href: "https://www.twinbrain.ai",
            target: "_blank",
            rel: "noopener noreferrer"
          }, React.createElement(Image, {
            src: "/logo_transparent.png",
            alt: "TwinBrain Logo",
            width: 50,
            height: 25
          })),
          React.createElement("span", {
            key: "separator",
            className: "text-white"
          }, "×"),
          React.createElement("a", {
            key: "sil",
            href: "https://www.sportsilab.com",
            target: "_blank",
            rel: "noopener noreferrer"
          }, React.createElement(Image, {
            src: "/sil-logo.png",
            alt: "Sports Innovation Lab Logo",
            width: 60,
            height: 25
          }))
        ]),
        React.createElement("button", {
          key: "close",
          onClick: onClose,
          className: "text-gray-200 hover:text-white text-2xl font-light"
        }, React.createElement(X, { size: 24 }))
      ]),

      // Nav Links Container
      React.createElement("div", {
        key: "links-container",
        className: "flex flex-col items-center space-y-4 py-4 mt-2 pb-12"
      }, [
        React.createElement("h1", {
          key: "title",
          className: `${inter.className} text-xl font-semibold tracking-tight mb-6`
        }, "SportsTechAI"),
        React.createElement("div", {
          key: "link-grid",
          className: "grid grid-cols-2 gap-x-10 gap-y-6 text-center w-full max-w-xs"
        }, [
          ...navItems.map((item) =>
            React.createElement("a", {
              key: item.label,
              href: item.href,
              target: item.target,
              rel: item.rel,
              onClick: (e) => {
                if (item.onClick) item.onClick(e);
                onClose();
              },
              className: "hover:underline text-base font-medium"
            }, item.label)
          ),
          React.createElement("a", {
            key: "newsletter",
            href: "#fixed-newsletter",
            onClick: onClose,
            className: "hover:underline text-base font-medium"
          }, "Newsletter")
        ])
      ])
    ])
  ]);
};

export default MobileMenu;