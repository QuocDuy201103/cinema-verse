// ===== API Response Types =====

export interface ApiPaginate {
  current_page: number;
  total_page: number;
  total_items: number;
  items_per_page: number;
}

/** Item in list responses */
export interface ApiMovieItem {
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created: string;
  modified: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  quality: string;
  language: string;
  director: string | null;
  casts: string | null;
}

export interface ApiListResponse {
  status: string;
  paginate: ApiPaginate;
  items: ApiMovieItem[];
}

// ===== Detail Response Types =====

export interface ApiEpisodeItem {
  name: string;
  slug: string;
  embed: string;
  m3u8: string;
}

export interface ApiEpisodeServer {
  server_name: string;
  items: ApiEpisodeItem[];
}

export interface ApiCategoryGroup {
  group: { id: string; name: string };
  list: { id: string; name: string }[];
}

export interface ApiMovieDetail {
  id: string;
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created: string;
  modified: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  quality: string;
  language: string;
  director: string | null;
  casts: string | null;
  category: {
    [key: string]: ApiCategoryGroup;
  };
  episodes: ApiEpisodeServer[];
}

export interface ApiDetailResponse {
  status: string;
  movie: ApiMovieDetail;
}

export interface ApiSearchResponse {
  status: string;
  paginate?: ApiPaginate;
  items: ApiMovieItem[];
}
