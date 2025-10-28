import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";

// Mock Link and SVG for single-file environment
const Link = ({ to, className, children }) => (
  <a href={to} className={className}>
    {children}
  </a>
);
const FaShoppingBasket = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-16 md:h-16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 8h-2V6a5 5 0 0 0-10 0v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-9-2a3 3 0 0 1 6 0v2h-6V6zm9 14H5v-4h14v4zm0-6H5v-2h14v2z" />
  </svg>
);

export default function Hero() {
  const { scrollY } = useScroll();
  const controls = useAnimation();

  // 1. Framer Motion Parallax Transform (instead of native useEffect/useState)
  // Moves the background image 30% slower than the foreground content
  const yBackground = useTransform(scrollY, [0, 400], [0, 120]);

  // 2. Fade overlay as you scroll (Opacity starts at 60% and fades to 10% after 250px scroll)
  const overlayOpacity = useTransform(scrollY, [0, 250], [0.6, 0.1]);

  // 3. Floating basket animation loop
  useEffect(() => {
    // Start the gentle floating animation
    controls.start({
      y: [0, -10, 0], // Move up by 10px, then back down
      x: [0, 5, 0], // Move right by 5px, then back left
      rotate: [0, 1, -1, 0], // Subtle rotation
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    });
  }, [controls]);

  return (
    <section className="relative h-[95vh] sm:h-[90vh] flex items-center justify-center bg-gray-900 overflow-hidden w-full">
      {/* Background Image with Parallax */}
      {/* Use motion.img for integrated Framer Motion transforms */}
      <motion.img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
        alt="Fresh groceries background"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          y: yBackground, // Apply Framer Motion Parallax
          willChange: "transform",
        }}
        loading="eager"
      />

      {/* Overlay for readability, transforming opacity on scroll */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content Container: Mobile-first centered, then aligned */}
      <div className="relative z-10 text-center max-w-7xl w-full px-6 sm:px-8 text-white mx-auto py-10 md:py-0">
        <div className="max-w-xl mx-auto md:mx-0 md:text-left">
          <h1 className="text-4xl xs:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 drop-shadow-2xl">
            Fresh Groceries{" "}
            <span className="text-green-400">Delivered To Your Doorstep</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 drop-shadow-lg">
            Healthy, organic, and locally sourced — your trusted grocery
            partner.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/products"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl shadow-green-700/50 hover:shadow-green-700/80 transform hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white/10 border border-white/30 text-white hover:bg-white/20 px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
            >
              Discover Our Mission
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
