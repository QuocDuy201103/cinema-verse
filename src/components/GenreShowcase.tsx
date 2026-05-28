"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const GENRES = [
  { slug: "hanh-dong", name: "Hành Động", icon: "💥", color: "#e50914" },
  { slug: "tinh-cam", name: "Tình Cảm", icon: "❤️", color: "#ec4899", image: "/4597190186614209792.jpeg" },
  { slug: "phim-hai", name: "Hài Hước", icon: "😂", color: "#f59e0b" },
  { slug: "kinh-di", name: "Kinh Dị", icon: "😱", color: "#6366f1" },
  { slug: "co-trang", name: "Cổ Trang", icon: "⚔️", color: "#78716c" },
  { slug: "khoa-hoc-vien-tuong", name: "Khoa Học Viễn Tưởng", icon: "🚀", color: "#06b6d4" },
  { slug: "tam-ly", name: "Tâm Lý", icon: "🎭", color: "#8b5cf6" },
  { slug: "toi-pham", name: "Tội Phạm", icon: "🔍", color: "#10b981" },
];

export default function GenreShowcase() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-4">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{ background: "var(--red-primary)", color: "white" }}>
          THỂ LOẠI
        </span>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Khám Phá Theo Thể Loại
        </h2>
        <div className="h-0.5 w-12 rounded-full" style={{ background: "var(--red-primary)" }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {GENRES.map((genre, i) => (
          <motion.div
            key={genre.slug}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={`/phim?genre=${genre.slug}`}
              className="block relative rounded-xl overflow-hidden group"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                aspectRatio: "4/3",
              }}
            >
              {/* Gradient BG (only if no image) */}
              {!genre.image && (
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 30% 50%, ${genre.color}, transparent 70%)`,
                  }}
                />
              )}

              {/* Image BG */}
              {genre.image && (
                <div className="absolute inset-0 z-0 flex items-center justify-center p-2">
                  <img src={genre.image} alt={genre.name} className="w-full h-full object-contain rounded-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
                </div>
              )}

              {/* Left accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all z-10"
                style={{ background: genre.color }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4 z-10">
                <span className="text-3xl mb-2">{genre.icon}</span>
                <h3 className="font-bold text-sm leading-tight" style={{ color: "white" }}>
                  {genre.name}
                </h3>
                <p className="text-xs mt-1 flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity"
                  style={{ color: genre.color }}>
                  Xem ngay →
                </p>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"
                style={{ boxShadow: `inset 0 0 30px ${genre.color}22` }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
