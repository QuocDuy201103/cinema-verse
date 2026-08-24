"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import MovieCard from "./MovieCard";
import { ApiMovieItem, ApiListResponse } from "@/types/api";
import {
  getNewMovies,
  getMoviesByCategory,
  getMoviesByGenre,
  getMoviesByCountry,
  getMoviesByYear,
  searchMovies,
} from "@/lib/api";

const CATEGORIES = [
  { slug: "all", label: "🎬 Tất Cả", type: "all" },
  { slug: "phim-le", label: "🎬 Phim Lẻ", type: "danh-sach" },
  { slug: "phim-bo", label: "📺 Phim Bộ", type: "danh-sach" },
  { slug: "hoat-hinh", label: "🎨 Hoạt Hình", type: "danh-sach" },
  { slug: "tv-shows", label: "📺 TV Shows", type: "danh-sach" },
];

const GENRES = [
  { slug: "hanh-dong", label: "💥 Hành Động" },
  { slug: "tinh-cam", label: "❤️ Tình Cảm" },
  { slug: "phim-hai", label: "😂 Hài Hước" },
  { slug: "kinh-di", label: "😱 Kinh Dị" },
  { slug: "co-trang", label: "⚔️ Cổ Trang" },
  { slug: "khoa-hoc-vien-tuong", label: "🚀 Khoa Học Viễn Tưởng" },
  { slug: "tam-ly", label: "🎭 Tâm Lý" },
  { slug: "toi-pham", label: "🔍 Tội Phạm" },
  { slug: "chien-tranh", label: "⚔️ Chiến Tranh" },
  { slug: "vien-tuong", label: "🧙 Viễn Tưởng" },
];

const COUNTRIES = [
  { slug: "au-my", label: "🇺🇸 Âu Mỹ" },
  { slug: "han-quoc", label: "🇰🇷 Hàn Quốc" },
  { slug: "trung-quoc", label: "🇨🇳 Trung Quốc" },
  { slug: "nhat-ban", label: "🇯🇵 Nhật Bản" },
  { slug: "thai-lan", label: "🇹🇭 Thái Lan" },
  { slug: "viet-nam", label: "🇻🇳 Việt Nam" },
];

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

type FilterMode = "category" | "genre" | "country" | "year" | "search";

interface FilterState {
  mode: FilterMode;
  slug: string;
  page: number;
  keyword: string;
}

export default function MovieGrid({ initialGenre = "" }: { initialGenre?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [movies, setMovies] = useState<ApiMovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filter, setFilter] = useState<FilterState>({
    mode: initialGenre ? "genre" : "category",
    slug: initialGenre || "all",
    page: 1,
    keyword: "",
  });

  useEffect(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) {
      setFilter((prev) => {
        if (prev.mode !== "genre" || prev.slug !== genreParam) {
          return { mode: "genre", slug: genreParam, page: 1, keyword: "" };
        }
        return prev;
      });
    } else if (searchParams.toString() === "") {
      // If we navigated to /phim without any query params (like clicking "Phim" in navbar)
      setFilter((prev) => {
        if (prev.mode !== "category" || prev.slug !== "all") {
           return { mode: "category", slug: "all", page: 1, keyword: "" };
        }
        return prev;
      });
    }
  }, [searchParams]);

  const fetchMovies = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      let data: ApiListResponse;

      if (f.mode === "search" && f.keyword) {
        data = (await searchMovies(f.keyword)) as unknown as ApiListResponse;
      } else if (f.mode === "genre") {
        data = await getMoviesByGenre(f.slug, f.page);
      } else if (f.mode === "country") {
        data = await getMoviesByCountry(f.slug, f.page);
      } else if (f.mode === "year") {
        data = await getMoviesByYear(f.slug, f.page);
      } else {
        // category
        if (f.slug === "all") {
          data = await getNewMovies(f.page);
        } else {
          data = await getMoviesByCategory(f.slug, f.page);
        }
      }

      setMovies(data.items || []);
      setTotalPages(data.paginate?.total_page || 1);
    } catch (err) {
      console.error("Error fetching movies in MovieGrid:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(filter);
  }, [filter, fetchMovies]);

  // Debounced search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!searchInput.trim()) {
      if (filter.mode === "search") {
        setFilter((f) => ({ ...f, mode: "category", slug: "phim-dang-chieu", keyword: "", page: 1 }));
      }
      return;
    }
    searchTimerRef.current = setTimeout(() => {
      setFilter({ mode: "search", slug: "", keyword: searchInput.trim(), page: 1 });
    }, 500);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchInput]);

  const setCategory = (slug: string) => {
    setSearchInput("");
    setFilter({ mode: "category", slug, page: 1, keyword: "" });
  };
  const setGenre = (slug: string) => {
    setSearchInput("");
    setFilter({ mode: "genre", slug, page: 1, keyword: "" });
  };
  const setCountry = (slug: string) => {
    setSearchInput("");
    setFilter({ mode: "country", slug, page: 1, keyword: "" });
  };
  const setYear = (slug: string) => {
    setSearchInput("");
    setFilter({ mode: "year", slug, page: 1, keyword: "" });
  };
  const setPage = (page: number) => setFilter((f) => ({ ...f, page }));

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  };

  const activeLabel = () => {
    if (filter.mode === "search") return `Kết quả: "${filter.keyword}"`;
    if (filter.mode === "genre") return GENRES.find((g) => g.slug === filter.slug)?.label || filter.slug;
    if (filter.mode === "country") return COUNTRIES.find((c) => c.slug === filter.slug)?.label || filter.slug;
    if (filter.mode === "year") return `Năm ${filter.slug}`;
    return CATEGORIES.find((c) => c.slug === filter.slug)?.label || filter.slug;
  };

  return (
    <div>
      {/* Sticky filter bar */}
      <div
        className="sticky top-16 sm:top-20 z-30 py-3"
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Search + Filter toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm phim, diễn viên, đạo diễn..."
                className="search-input"
              />
              {searchInput && (
                <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{
                background: showFilters ? "var(--red-primary)" : "var(--bg-card)",
                border: `1px solid ${showFilters ? "var(--red-primary)" : "var(--border)"}`,
                color: showFilters ? "white" : "var(--text-secondary)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Bộ Lọc</span>
            </motion.button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto scroll-row pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`genre-chip ${filter.mode === "category" && filter.slug === cat.slug ? "active" : ""}`}
                id={`cat-${cat.slug}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Advanced filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-3 pb-1">
                  {/* Genres */}
                  <div>
                    <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Thể Loại
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {GENRES.map((g) => (
                        <button
                          key={g.slug}
                          onClick={() => setGenre(g.slug)}
                          className={`genre-chip ${filter.mode === "genre" && filter.slug === g.slug ? "active" : ""}`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Countries */}
                  <div>
                    <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Quốc Gia
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => setCountry(c.slug)}
                          className={`genre-chip ${filter.mode === "country" && filter.slug === c.slug ? "active" : ""}`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Years */}
                  <div>
                    <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Năm Phát Hành
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {YEARS.map((y) => (
                        <button
                          key={y}
                          onClick={() => setYear(y)}
                          className={`genre-chip ${filter.mode === "year" && filter.slug === y ? "active" : ""}`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results info */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Đang xem:{" "}
          <span className="font-semibold" style={{ color: "var(--red-primary)" }}>
            {activeLabel()}
          </span>
        </p>
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--red-primary)" }} />
        )}
      </div>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)" }}>
                <div className="skeleton h-64" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3 rounded w-3/4" />
                  <div className="skeleton h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filter.mode}-${filter.slug}-${filter.page}-${filter.keyword}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5"
            >
              {movies.map((movie, i) => (
                <motion.div key={`${movie.slug}-${i}`} variants={itemVariants}>
                  <MovieCard movie={movie} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Không tìm thấy phim nào</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button onClick={() => setCategory("all")} className="btn-primary text-sm">
              Xem Tất Cả Phim
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && filter.mode !== "search" && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.max(1, filter.page - 1))}
              disabled={filter.page === 1}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center disabled:opacity-30"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let startPage = Math.max(1, filter.page - 2);
              if (startPage + 4 > totalPages) {
                startPage = Math.max(1, totalPages - 4);
              }
              const page = startPage + i;
              return (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(page)}
                  className="w-10 h-10 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: filter.page === page ? "var(--red-primary)" : "var(--bg-card)",
                    color: filter.page === page ? "white" : "var(--text-secondary)",
                    border: `1px solid ${filter.page === page ? "var(--red-primary)" : "var(--border)"}`,
                  }}
                >
                  {page}
                </motion.button>
              );
            })}

            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.min(totalPages, filter.page + 1))}
              disabled={filter.page === totalPages}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center disabled:opacity-30"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            Trang {filter.page} / {totalPages.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
