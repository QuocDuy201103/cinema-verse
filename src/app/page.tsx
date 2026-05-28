import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import StatsSection from "@/components/StatsSection";
import GenreShowcase from "@/components/GenreShowcase";
import { getNewMovies, getMoviesByCategory } from "@/lib/api";

export const metadata: Metadata = {
  title: "CinemaVerse – Xem Phim Trực Tuyến Chất Lượng Cao",
  description:
    "Khám phá hàng nghìn bộ phim chất lượng cao. Xem phim HD & 4K mọi lúc, mọi nơi.",
};

export default async function HomePage() {
  // Fetch all sections in parallel
  const [newData, dangChieuData, phimLeData, phimBoData] = await Promise.allSettled([
    getNewMovies(1),
    getMoviesByCategory("phim-dang-chieu", 1),
    getMoviesByCategory("phim-le", 1),
    getMoviesByCategory("phim-bo", 1),
  ]);

  const newMovies = newData.status === "fulfilled" ? newData.value.items : [];
  const dangChieu = dangChieuData.status === "fulfilled" ? dangChieuData.value.items : [];
  const phimLe = phimLeData.status === "fulfilled" ? phimLeData.value.items : [];
  const phimBo = phimBoData.status === "fulfilled" ? phimBoData.value.items : [];

  // Hero gets the first 6 movies from "đang chiếu"
  const heroMovies = dangChieu.slice(0, 6);

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <HeroBanner movies={heroMovies.length ? heroMovies : newMovies.slice(0, 6)} />

      {/* Mới cập nhật */}
      <section className="pt-10">
        <MovieRow title="Mới Cập Nhật" movies={newMovies} badge="MỚI" showRank />
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Đang chiếu */}
      <MovieRow
        title="Phim Đang Chiếu"
        movies={dangChieu}
        badge="HOT"
        badgeColor="var(--red-primary)"
      />

      {/* Genre Showcase */}
      <GenreShowcase />

      {/* Phim lẻ */}
      <MovieRow
        title="Phim Lẻ Hay"
        movies={phimLe}
        badge="PHIM LẺ"
        badgeColor="rgba(99,102,241,0.9)"
      />

      {/* Phim bộ */}
      <MovieRow
        title="Phim Bộ Hấp Dẫn"
        movies={phimBo}
        badge="PHIM BỘ"
        badgeColor="rgba(16,185,129,0.9)"
      />
    </div>
  );
}
