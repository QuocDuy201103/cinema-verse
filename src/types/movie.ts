export interface Movie {
  id: number;
  title: string;
  slug: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  description: string;
  longDescription: string;
  director: string;
  cast: string[];
  poster: string;
  backdrop: string;
  trailer?: string;
  featured?: boolean;
  trending?: boolean;
  new?: boolean;
  language: string;
  country: string;
  quality: "HD" | "4K" | "CAM";
  views: number;
  likes: number;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
}
