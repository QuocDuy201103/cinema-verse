"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { ApiMovieItem, ApiListResponse } from "@/types/api";
import { getNewMovies, getMoviesByCategory } from "@/lib/api";

interface MovieRowProps {
  title: string;
  movies: ApiMovieItem[];
  categorySlug?: string;
  isNewMovies?: boolean;
  badge?: string;
  badgeColor?: string;
  showRank?: boolean;
}

export default function MovieRow({
  title,
  movies: initialMovies = [],
  categorySlug,
  isNewMovies = false,
  badge,
  badgeColor = "var(--red-primary)",
  showRank = false,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<ApiMovieItem[]>(initialMovies);

  useEffect(() => {
    if (initialMovies.length > 0) {
      setMovies(initialMovies);
    }
  }, [initialMovies]);

  useEffect(() => {
    if (movies.length > 0) return;
    async function loadFallback() {
      try {
        let res: ApiListResponse;
        if (isNewMovies) {
          res = await getNewMovies(1);
        } else if (categorySlug) {
          res = await getMoviesByCategory(categorySlug, 1);
        } else {
          return;
        }
        if (res?.items) setMovies(res.items);
      } catch {
        // Fallback fail
      }
    }
    loadFallback();
  }, [movies.length, isNewMovies, categorySlug]);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  if (!movies?.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          {badge && (
            <span
              className="text-xs font-black px-2.5 py-1 rounded-full"
              style={{ background: badgeColor, color: "white" }}
            >
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
          <div className="h-0.5 w-12 rounded-full" style={{ background: badgeColor }} />
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10"
            style={{ color: "var(--text-secondary)" }} aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10"
            style={{ color: "var(--text-secondary)" }} aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden sm:block"
          style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden sm:block"
          style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }} />

        <div ref={rowRef} className="scroll-row flex gap-4 px-4 sm:px-6 lg:px-8">
          {movies.map((movie, i) => (
            <div key={`${movie.slug}-${i}`} className="relative">
              {showRank && (
                <div
                  className="absolute -left-2 bottom-12 z-20 text-6xl sm:text-7xl font-black leading-none select-none pointer-events-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "2px rgba(255,255,255,0.15)",
                  }}
                >
                  {i + 1}
                </div>
              )}
              <MovieCard movie={movie} index={i} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
