"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Film, Menu, X, Loader2, LogOut, User as UserIcon, Cat, Dog, Ghost, Smile, Rocket, Star, Zap, Heart, Bot, Sun, Moon } from "lucide-react";
import { ApiMovieItem } from "@/types/api";
import { searchMovies } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import AuthModal from "@/components/AuthModal";

const ICON_MAP: Record<string, any> = {
  user: UserIcon, cat: Cat, dog: Dog, ghost: Ghost, smile: Smile,
  rocket: Rocket, star: Star, zap: Zap, heart: Heart, bot: Bot
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiMovieItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleOpenAuthModal = () => setAuthModalOpen(true);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-auth-modal", handleOpenAuthModal);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("cinemaverse_theme") || "dark";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("cinemaverse_theme", theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const data = await searchMovies(searchQuery.trim());
        setSearchResults((data.items ?? []).slice(0, 6));
      } catch (err) {
        console.error("Error searching movies in Navbar:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/phim", label: "Phim" },
    { href: "/phim?genre=hanh-dong", label: "Hành Động" },
    { href: "/phim?genre=tinh-cam", label: "Tình Cảm" },
    { href: "/phim?genre=co-trang", label: "Cổ Trang" },
  ];

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(10, 10, 10, 0.97)" : "rgba(10, 10, 10, 0)",
          borderBottomColor: scrolled ? "rgba(42, 42, 42, 1)" : "rgba(42, 42, 42, 0)",
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backdropFilter: scrolled ? "blur(16px)" : "none" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--red-primary)" }}>
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight hidden sm:block" style={{ color: "var(--text-primary)" }}>
                  Cinema<span style={{ color: "var(--red-primary)" }}>Verse</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm ${pathname === link.href.split("?")[0] && !link.href.includes("?") ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: searchOpen ? "var(--red-primary)" : "var(--text-secondary)" }}
                  aria-label="Tìm kiếm"
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-80 sm:w-96"
                    >
                      <div className="rounded-xl overflow-hidden shadow-2xl"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                        <div className="p-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                          {searchLoading
                            ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "var(--text-muted)" }} />
                            : <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                          }
                          <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm phim..."
                            className="bg-transparent outline-none text-sm w-full"
                            style={{ color: "var(--text-primary)" }}
                          />
                          {searchQuery && (
                            <button onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
                              <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                            </button>
                          )}
                        </div>

                        {searchResults.length > 0 ? (
                          <div className="py-2">
                            {searchResults.map((movie) => (
                              <Link
                                key={movie.slug}
                                href={`/phim/${movie.slug}`}
                                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-white/5"
                              >
                                <img
                                  src={movie.poster_url || movie.thumb_url}
                                  alt={movie.name}
                                  className="w-10 h-14 object-cover rounded-md shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                                    {movie.name}
                                  </p>
                                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                    {movie.current_episode} • {movie.language}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                                  style={{ background: "var(--red-primary)", color: "white" }}>
                                  {movie.quality}
                                </span>
                              </Link>
                            ))}
                            <div className="px-4 py-2 border-t" style={{ borderColor: "var(--border)" }}>
                              <Link
                                href={`/phim?q=${encodeURIComponent(searchQuery)}`}
                                onClick={() => { setSearchOpen(false); }}
                                className="text-xs font-medium transition-colors hover:text-white"
                                style={{ color: "var(--red-primary)" }}
                              >
                                Xem tất cả kết quả →
                              </Link>
                            </div>
                          </div>
                        ) : searchQuery.length >= 2 && !searchLoading ? (
                          <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                            Không tìm thấy phim nào
                          </div>
                        ) : (
                          <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                            Nhập tên phim để tìm kiếm
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative p-2 hidden sm:flex rounded-full transition-colors hover:bg-white/5"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Chuyển giao diện"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Avatar / Auth */}
              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="relative group cursor-pointer">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all"
                      style={{ background: "var(--red-primary)", color: "white" }}>
                      {ICON_MAP[user.avatar_icon] ? (() => {
                        const IconComponent = ICON_MAP[user.avatar_icon];
                        return <IconComponent className="w-5 h-5" />;
                      })() : user.username.charAt(0).toUpperCase()}
                    </div>
                    {/* Tooltip & Logout */}
                    <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50 pt-2">
                      <div className="rounded-xl overflow-hidden shadow-2xl p-2 w-48"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                        <div className="px-3 py-2 border-b mb-1" style={{ borderColor: "var(--border)" }}>
                          <p className="font-bold text-sm truncate" style={{ color: "var(--text-primary)" }}>{user.username}</p>
                        </div>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
                          style={{ color: "var(--red-primary)" }}
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: "var(--red-primary)", color: "white" }}
                >
                  <UserIcon className="w-4 h-4" />
                  Đăng Nhập
                </button>
              )}

              {/* Mobile menu */}
              <div className="flex items-center gap-1 md:hidden">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label="Chuyển giao diện"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-2 rounded-full"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label="Menu"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-72 z-40 flex flex-col"
            style={{ background: "var(--bg-secondary)", borderLeft: "1px solid var(--border)" }}
          >
            <div className="flex items-center p-6 pt-20">
              <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Menu</span>
            </div>

            <nav className="flex-1 px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: pathname === link.href.split("?")[0] && !link.href.includes("?") ? "var(--text-primary)" : "var(--text-secondary)",
                      background: pathname === link.href.split("?")[0] && !link.href.includes("?") ? "rgba(229, 9, 20, 0.1)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="p-6 border-t" style={{ borderColor: "var(--border)" }}>
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "var(--red-primary)", color: "white" }}>
                      {ICON_MAP[user.avatar_icon] ? (() => {
                        const IconComponent = ICON_MAP[user.avatar_icon];
                        return <IconComponent className="w-5 h-5" />;
                      })() : user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    style={{ background: "rgba(229, 9, 20, 0.1)", color: "var(--red-primary)" }}
                  >
                    <LogOut className="w-4 h-4" /> Đăng Xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthModalOpen(true); setMobileOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: "var(--red-primary)", color: "white" }}
                >
                  <UserIcon className="w-4 h-4" /> Đăng Nhập
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
