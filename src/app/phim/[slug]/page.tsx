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

  let movie = null;
  try {
    const data = await getMovieDetail(slug);
    if (data?.movie) {
      movie = data.movie;
    }
  } catch {
    movie = null;
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <MovieDetailClient slug={slug} initialMovie={movie} />
    </div>
  );
}
