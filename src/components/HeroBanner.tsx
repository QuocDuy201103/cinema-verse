"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Tv, ChevronLeft, ChevronRight, Clock, Globe } from "lucide-react";
import { ApiMovieItem } from "@/types/api";

interface HeroBannerProps {
  movies: ApiMovieItem[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = movies[currentIndex];

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((i) => (i + 1) % movies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  const prev = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + movies.length) % movies.length);
  };
  const next = () => {
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % movies.length);
  };

  if (!movies.length || !current) return null;

  const isCompleted = current.current_episode?.toLowerCase().includes("hoàn tất");

  return (
    <div className="relative overflow-hidden" style={{ height: "clamp(520px, 90vh, 820px)" }}>
      {/* Backdrop */}
      <AnimatePresence custom={direction} initial={false} mode="sync">
        <motion.div
          key={current.slug}
          custom={direction}
          initial={{ x: direction > 0 ? "8%" : "-8%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? "-8%" : "8%", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src={current.poster_url || current.thumb_url}
            alt={current.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.45)" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradients */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 40%)" }} />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 md:items-center md:pb-0">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "var(--red-primary)", color: "white" }}
                >
                  🔥 Nổi Bật
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full glass" style={{ color: "white" }}>
                  {current.quality}
                </span>
                {current.total_episodes > 1 && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                    style={{
                      background: isCompleted ? "rgba(16,185,129,0.85)" : "rgba(229,9,20,0.15)",
                      color: isCompleted ? "white" : "var(--red-primary)",
                      border: isCompleted ? "none" : "1px solid rgba(229,9,20,0.3)",
                    }}
                  >
                    <Tv className="w-3 h-3" />
                    {current.current_episode}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-2" style={{ color: "var(--text-primary)" }}>
                {current.name}
              </h1>
              {current.original_name && (
                <p className="text-base sm:text-lg font-medium mb-4 italic" style={{ color: "var(--text-muted)" }}>
                  {current.original_name}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {current.language}
                </span>
                <span style={{ color: "var(--border)" }}>|</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {current.time}
                </span>
                {current.total_episodes > 1 && (
                  <>
                    <span style={{ color: "var(--border)" }}>|</span>
                    <span className="flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5" />
                      {current.total_episodes} tập
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base leading-relaxed mb-8 line-clamp-3 max-w-lg" style={{ color: "var(--text-secondary)" }}>
                {current.description?.replace(/<[^>]*>/g, "")}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/phim/${current.slug}`} className="btn-primary">
                  <Play className="w-5 h-5 fill-current" />
                  Xem Ngay
                </Link>
                <Link href={`/phim/${current.slug}`} className="btn-secondary">
                  <Info className="w-5 h-5" />
                  Chi Tiết
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 hidden sm:flex text-white"
        aria-label="Trước">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 hidden sm:flex text-white"
        aria-label="Sau">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:left-auto sm:translate-x-0 sm:right-8">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === currentIndex ? "24px" : "8px",
              height: "8px",
              background: i === currentIndex ? "var(--red-primary)" : "rgba(255,255,255,0.3)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
        {movies.slice(0, 4).map((movie, i) => (
          <motion.button
            key={movie.slug}
            onClick={() => goTo(i)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="relative w-20 h-28 rounded-lg overflow-hidden"
            style={{
              border: i === currentIndex ? "2px solid var(--red-primary)" : "2px solid transparent",
              opacity: i === currentIndex ? 1 : 0.5,
            }}
          >
            <img src={movie.poster_url || movie.thumb_url} alt={movie.name} className="w-full h-full object-cover" />
            {i === currentIndex && (
              <div className="absolute inset-0 opacity-30" style={{ background: "var(--red-primary)" }} />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
