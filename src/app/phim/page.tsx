import type { Metadata } from "next";
import { Suspense } from "react";
import MovieGrid from "@/components/MovieGrid";

export const metadata: Metadata = {
  title: "Danh Sách Phim | CinemaVerse",
  description:
    "Khám phá toàn bộ kho phim với hàng nghìn bộ phim chất lượng cao theo nhiều thể loại khác nhau.",
};

interface MoviesPageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const genre = params?.genre || "";

  return (
    <div style={{ background: "var(--bg-primary)" }} className="pt-16 sm:pt-20">
      {/* Page header */}
      {/* <div
        className="relative overflow-hidden py-14 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(229,9,20,0.12) 0%, rgba(10,10,10,0.9) 40%, rgba(10,10,10,1) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(229, 9, 20, 0.15)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(99, 102, 241, 0.08)" }}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-8 rounded-full" style={{ background: "var(--red-primary)" }} />
            <span
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--red-primary)" }}
            >
              Kho Phim
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Danh Sách Phim
          </h1>
          <p className="text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
            Hàng chục nghìn bộ phim chất lượng cao từ khắp nơi trên thế giới. Xem phim theo thể
            loại, quốc gia, năm phát hành và nhiều hơn nữa.
          </p>
        </div>
      </div> */}

      <Suspense fallback={<div className="h-20" />}>
        <MovieGrid initialGenre={genre} />
      </Suspense>
    </div>
  );
}
