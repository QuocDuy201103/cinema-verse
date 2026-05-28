"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, ChevronLeft, Heart, Share2, Bookmark,
  Clock, Globe, Calendar, Tv, Award, Server,
  ChevronDown, ChevronUp, MonitorPlay
} from "lucide-react";
import { ApiMovieDetail, ApiEpisodeItem } from "@/types/api";

interface Props {
  movie: ApiMovieDetail;
}

export default function MovieDetailClient({ movie }: Props) {
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState<ApiEpisodeItem | null>(null);
  const [showAllEps, setShowAllEps] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const server = movie.episodes?.[selectedServer];
  const episodes = server?.items ?? [];
  const displayedEps = showAllEps ? episodes : episodes.slice(0, 24);

  const currentEp = selectedEpisode ?? episodes[0] ?? null;
  const isCompleted = movie.current_episode?.toLowerCase().includes("hoàn tất");
  const isSeries = movie.total_episodes > 1;

  // Category helpers
  const genres = movie.category?.["2"]?.list ?? [];
  const years = movie.category?.["3"]?.list ?? [];
  const countries = movie.category?.["4"]?.list ?? [];
  const formats = movie.category?.["1"]?.list ?? [];

  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") ?? "";

  return (
    <div className="pt-16 sm:pt-20">
      {/* Player section */}
      <div style={{ background: "#000" }}>
        <div className="max-w-[1400px] mx-auto">
          {currentEp ? (
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <iframe
                key={currentEp.embed}
                src={currentEp.embed}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={`${movie.name} - ${currentEp.name}`}
                style={{ border: "none" }}
              />
            </div>
          ) : (
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "16/7", maxHeight: "540px" }}
            >
              <img
                src={movie.thumb_url}
                alt={movie.name}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.3)" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4">
                <MonitorPlay className="w-16 h-16" style={{ color: "var(--red-primary)" }} />
                <p className="text-lg font-bold" style={{ color: "white" }}>
                  Chọn tập để xem
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Episode bar */}
      {isSeries && episodes.length > 0 && (
        <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Server tabs */}
            {movie.episodes.length > 1 && (
              <div className="flex items-center gap-2 mb-3 overflow-x-auto scroll-row pb-1">
                <span className="text-xs font-bold shrink-0" style={{ color: "var(--text-muted)" }}>
                  <Server className="w-3.5 h-3.5 inline mr-1" />
                  Server:
                </span>
                {movie.episodes.map((srv, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedServer(i); setSelectedEpisode(null); }}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: selectedServer === i ? "var(--red-primary)" : "var(--bg-card)",
                      color: selectedServer === i ? "white" : "var(--text-secondary)",
                      border: `1px solid ${selectedServer === i ? "var(--red-primary)" : "var(--border)"}`,
                    }}
                  >
                    {srv.server_name}
                  </button>
                ))}
              </div>
            )}

            {/* Episodes grid */}
            <div className="flex flex-wrap gap-2">
              {displayedEps.map((ep) => {
                const isActive = currentEp?.slug === ep.slug;
                return (
                  <motion.button
                    key={ep.slug}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedEpisode(ep)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: isActive ? "var(--red-primary)" : "var(--bg-card)",
                      color: isActive ? "white" : "var(--text-secondary)",
                      border: `1px solid ${isActive ? "var(--red-primary)" : "var(--border)"}`,
                      minWidth: "44px",
                    }}
                    id={`ep-${ep.slug}`}
                  >
                    {ep.name}
                  </motion.button>
                );
              })}
            </div>

            {episodes.length > 24 && (
              <button
                onClick={() => setShowAllEps(!showAllEps)}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-white"
                style={{ color: "var(--red-primary)" }}
              >
                {showAllEps ? (
                  <><ChevronUp className="w-3.5 h-3.5" /> Thu gọn</>
                ) : (
                  <><ChevronDown className="w-3.5 h-3.5" /> Xem tất cả {episodes.length} tập</>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Back */}
            <Link
              href="/phim"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white group"
              style={{ color: "var(--text-muted)" }}
            >
              <motion.span whileHover={{ x: -4 }} className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Danh Sách Phim
              </motion.span>
            </Link>

            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "var(--red-primary)", color: "white" }}>
                  {movie.quality}
                </span>
                {isCompleted ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                    ✓ Hoàn Tất
                  </span>
                ) : isSeries && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ background: "rgba(229,9,20,0.1)", color: "var(--red-primary)", border: "1px solid rgba(229,9,20,0.3)" }}>
                    <Tv className="w-3 h-3" />
                    {movie.current_episode}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2"
                style={{ color: "var(--text-primary)" }}>
                {movie.name}
              </h1>
              {movie.original_name && (
                <p className="text-base italic" style={{ color: "var(--text-muted)" }}>
                  {movie.original_name}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {episodes[0] && (
                <button
                  onClick={() => setSelectedEpisode(episodes[0])}
                  className="btn-primary"
                  id="btn-watch-first"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {isSeries ? "Xem Tập 1" : "Xem Phim"}
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSaved(!saved)}
                className="btn-secondary py-3 px-5"
                id="btn-save"
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                {saved ? "Đã Lưu" : "Xem Sau"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => setLiked(!liked)}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center"
                style={{ color: liked ? "#e50914" : "var(--text-secondary)" }}
                id="btn-like" aria-label="Thích"
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigator.share?.({ title: movie.name, url: window.location.href })}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center"
                style={{ color: "var(--text-secondary)" }}
                id="btn-share" aria-label="Chia sẻ"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Description */}
            {movie.description && (
              <div>
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  Nội Dung Phim
                </h2>
                <p className="leading-relaxed text-base" style={{ color: "var(--text-secondary)" }}>
                  {stripHtml(movie.description)}
                </p>
              </div>
            )}

            {/* Director & Cast */}
            {movie.director && (
              <div>
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  Đạo Diễn
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie.director.split(",").map((d) => (
                    <span key={d} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--red-primary)", color: "white" }}>
                        {d.trim().charAt(0)}
                      </span>
                      {d.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.casts && (
              <div>
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                  Diễn Viên
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie.casts.split(",").slice(0, 10).map((actor) => (
                    <span key={actor} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: `hsl(${actor.trim().charCodeAt(0) * 15 % 360},50%,25%)`,
                          color: "white",
                        }}
                      >
                        {actor.trim().charAt(0)}
                      </span>
                      {actor.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            {/* Poster */}
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid var(--border)" }}>
              <img src={movie.poster_url || movie.thumb_url} alt={movie.name} className="w-full object-cover" />
            </div>

            {/* Info */}
            <div className="rounded-2xl p-5 space-y-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Thông Tin</h3>

              {[
                { icon: Clock, label: "Thời lượng", value: movie.time },
                { icon: Globe, label: "Ngôn ngữ", value: movie.language },
                { icon: Calendar, label: "Năm", value: years.map(y => y.name).join(", ") || "—" },
                { icon: Globe, label: "Quốc gia", value: countries.map(c => c.name).join(", ") || "—" },
                { icon: Tv, label: "Định dạng", value: formats.map(f => f.name).join(", ") || "—" },
                ...(isSeries ? [{ icon: Tv, label: "Số tập", value: `${movie.current_episode} / ${movie.total_episodes}` }] : []),
              ].map(({ icon: Icon, label, value }) => value && (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </div>
                  <span className="font-semibold text-right ml-2 max-w-[55%]"
                    style={{ color: "var(--text-primary)" }}>
                    {value}
                  </span>
                </div>
              ))}

              {/* Quality bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Chất lượng</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--red-primary)" }}>
                    {movie.quality}
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--bg-secondary)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: movie.quality === "4K" ? "100%" : movie.quality === "FHD" ? "85%" : "70%" }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(to right, var(--red-primary), #ff6b6b)" }}
                  />
                </div>
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="rounded-2xl p-5"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>Thể Loại</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => {
                    const slug = g.name.toLowerCase()
                      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                      .replace(/đ/g, "d").replace(/\s+/g, "-");
                    return (
                      <Link
                        key={g.id}
                        href={`/phim?genre=${slug}`}
                        className="genre-chip text-xs"
                      >
                        {g.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
