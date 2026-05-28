"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Clock, Bookmark, Eye, Tv } from "lucide-react";
import { ApiMovieItem } from "@/types/api";

interface MovieCardProps {
  movie: ApiMovieItem;
  index?: number;
  size?: "sm" | "md" | "lg";
}

export default function MovieCard({ movie, index = 0, size = "md" }: MovieCardProps) {
  const sizeClasses = {
    sm: { card: "w-36 sm:w-44", img: "h-52 sm:h-60" },
    md: { card: "w-full", img: "h-64 sm:h-72" },
    lg: { card: "w-full", img: "h-72 sm:h-80" },
  };
  const { card, img } = sizeClasses[size];

  const isCompleted = movie.current_episode?.toLowerCase().includes("hoàn tất");
  const isSeries = movie.total_episodes > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`${card} shrink-0 h-full`}
    >
      <Link href={`/phim/${movie.slug}`} className="block group h-full">
        <div className="movie-card card-shine h-full flex flex-col" style={{ background: "var(--bg-card)" }}>
          {/* Poster */}
          <div className={`relative ${img} shrink-0 overflow-hidden`}>
            <img
              src={movie.poster_url || movie.thumb_url}
              alt={movie.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="movie-card-overlay" />

            {/* Top badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10">
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded"
                style={{
                  background: movie.quality === "4K"
                    ? "var(--red-primary)"
                    : "rgba(0,0,0,0.65)",
                  color: "white",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {movie.quality}
              </span>

              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="w-7 h-7 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Lưu phim"
              >
                <Bookmark className="w-3.5 h-3.5 text-white" />
              </motion.button>
            </div>

            {/* Episode badge */}
            {isSeries && (
              <div className="absolute top-10 left-2.5 z-10">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    background: isCompleted ? "rgba(16,185,129,0.85)" : "rgba(229,9,20,0.85)",
                    color: "white",
                  }}
                >
                  <Tv className="w-2.5 h-2.5" />
                  {movie.current_episode}
                </span>
              </div>
            )}

            {/* Play on hover */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                className="play-btn"
              >
                <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
              </motion.div>
            </div>

            {/* Bottom meta on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {movie.language}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.time}
                </span>
              </div>
            </div>
          </div>

          {/* Card info */}
          <div className="p-3 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(229,9,20,0.12)",
                  color: "var(--red-primary)",
                  border: "1px solid rgba(229,9,20,0.2)",
                }}
              >
                {movie.language}
              </span>
              <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                {new Date(movie.modified).getFullYear()}
              </span>
            </div>

            <h3
              className="font-semibold text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-white transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {movie.name}
            </h3>

            {movie.original_name && (
              <p className="text-[11px] line-clamp-1 mt-auto" style={{ color: "var(--text-muted)" }}>
                {movie.original_name}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
