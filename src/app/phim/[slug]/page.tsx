import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { getMovieDetail, getMoviesByGenre } from "@/lib/api";
import MovieDetailClient from "@/components/MovieDetailClient";
import MovieRow from "@/components/MovieRow";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getMovieDetail(slug);
    const m = data.movie;
    return {
      title: `${m.name} | CinemaVerse`,
      description: m.description?.replace(/<[^>]*>/g, "").slice(0, 160),
      openGraph: {
        title: m.name,
        description: m.description?.replace(/<[^>]*>/g, "").slice(0, 160),
        images: [m.thumb_url],
      },
    };
  } catch {
    return { title: "Phim | CinemaVerse" };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;

  let data;
  try {
    data = await getMovieDetail(slug);
  } catch {
    notFound();
  }

  if (!data?.movie) notFound();

  const movie = data.movie;

  // Extract genre slug for related movies
  const genreList = movie.category?.["2"]?.list ?? [];
  const firstGenreSlug = genreList[0]?.name
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-") ?? "";

  let related: Awaited<ReturnType<typeof getMoviesByGenre>>["items"] = [];
  if (firstGenreSlug) {
    try {
      const relData = await getMoviesByGenre(firstGenreSlug, 1);
      related = relData.items.filter((m) => m.slug !== slug).slice(0, 10);
    } catch {
      related = [];
    }
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <MovieDetailClient movie={movie} />
      {related.length > 0 && (
        <div className="mt-8">
          <MovieRow
            title="Phim Liên Quan"
            movies={related}
            badge="GỢI Ý"
            badgeColor="rgba(99,102,241,0.9)"
          />
        </div>
      )}
    </div>
  );
}
