import {
  ApiListResponse,
  ApiDetailResponse,
  ApiSearchResponse,
} from "@/types/api";

const BASE = "https://phim.nguonc.com/api";

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } }); // 5-min cache
  if (!res.ok) throw new Error(`API error: ${res.status} ${url}`);
  return res.json();
}

/** Phim mới cập nhật */
export function getNewMovies(page = 1) {
  return fetchApi<ApiListResponse>(
    `${BASE}/films/phim-moi-cap-nhat?page=${page}`
  );
}

/** Phim theo danh mục slug: phim-dang-chieu | phim-le | phim-bo | hoat-hinh */
export function getMoviesByCategory(slug: string, page = 1) {
  return fetchApi<ApiListResponse>(
    `${BASE}/films/danh-sach/${slug}?page=${page}`
  );
}

/** Chi tiết phim & danh sách tập */
export function getMovieDetail(slug: string) {
  return fetchApi<ApiDetailResponse>(`${BASE}/film/${slug}`);
}

/** Phim theo thể loại */
export function getMoviesByGenre(slug: string, page = 1) {
  return fetchApi<ApiListResponse>(
    `${BASE}/films/the-loai/${slug}?page=${page}`
  );
}

/** Phim theo quốc gia */
export function getMoviesByCountry(slug: string, page = 1) {
  return fetchApi<ApiListResponse>(
    `${BASE}/films/quoc-gia/${slug}?page=${page}`
  );
}

/** Phim theo năm */
export function getMoviesByYear(slug: string, page = 1) {
  return fetchApi<ApiListResponse>(
    `${BASE}/films/nam-phat-hanh/${slug}?page=${page}`
  );
}

/** Tìm kiếm phim */
export function searchMovies(keyword: string) {
  return fetchApi<ApiSearchResponse>(
    `${BASE}/films/search?keyword=${encodeURIComponent(keyword)}`
  );
}
