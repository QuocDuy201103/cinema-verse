import {
  ApiListResponse,
  ApiDetailResponse,
  ApiSearchResponse,
} from "@/types/api";

const BASE = "https://phim.nguonc.com/api";

export interface FetchApiOptions {
  revalidate?: number | false;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
  Thực hiện request HTTP có hỗ trợ Timeout và AbortSignal
 */
async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
  Hàm gọi API chung với cơ chế Retry có khoảng nghỉ & xử lý lỗi mạng
 */
async function fetchApi<T>(
  endpoint: string,
  options: FetchApiOptions = {}
): Promise<T> {
  const {
    revalidate = 300,
    timeoutMs = 8000,
    retries = 2,
    retryDelayMs = 1000,
  } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${BASE}${endpoint}`;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchOptions: RequestInit = {};
      if (revalidate !== undefined && typeof window === "undefined") {
        // Cấu hình cache cho Next.js Server Side Fetch
        (fetchOptions as any).next = { revalidate };
      }

      const res = await fetchWithTimeout(url, fetchOptions, timeoutMs);
      if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText} (${url})`);
      }
      const data = await res.json();
      return data as T;
    } catch (err: unknown) {
      lastError = err;
      if (attempt < retries) {
        // Tăng thời gian chờ cho các lần retry tiếp theo (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelayMs * (attempt + 1))
        );
      }
    }
  }

  console.error(`[API Error] Failed fetching ${url} after ${retries + 1} attempts:`, lastError);
  throw lastError;
}

/** Phim mới cập nhật */
export function getNewMovies(page = 1, options?: FetchApiOptions) {
  return fetchApi<ApiListResponse>(`/films/phim-moi-cap-nhat?page=${page}`, options);
}

/** Phim theo danh mục slug: phim-dang-chieu | phim-le | phim-bo | hoat-hinh */
export function getMoviesByCategory(slug: string, page = 1, options?: FetchApiOptions) {
  return fetchApi<ApiListResponse>(`/films/danh-sach/${slug}?page=${page}`, options);
}

/** Chi tiết phim & danh sách tập */
export function getMovieDetail(slug: string, options?: FetchApiOptions) {
  return fetchApi<ApiDetailResponse>(`/film/${slug}`, options);
}

/** Phim theo thể loại */
export function getMoviesByGenre(slug: string, page = 1, options?: FetchApiOptions) {
  return fetchApi<ApiListResponse>(`/films/the-loai/${slug}?page=${page}`, options);
}

/** Phim theo quốc gia */
export function getMoviesByCountry(slug: string, page = 1, options?: FetchApiOptions) {
  return fetchApi<ApiListResponse>(`/films/quoc-gia/${slug}?page=${page}`, options);
}

/** Phim theo năm */
export function getMoviesByYear(year: string | number, page = 1, options?: FetchApiOptions) {
  return fetchApi<ApiListResponse>(`/films/nam-phat-hanh/${year}?page=${page}`, options);
}

/** Tìm kiếm phim */
export function searchMovies(keyword: string, options?: FetchApiOptions) {
  return fetchApi<ApiSearchResponse>(
    `/films/search?keyword=${encodeURIComponent(keyword)}`,
    options
  );
}
