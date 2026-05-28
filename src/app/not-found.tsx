"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center"
          style={{ background: "rgba(229, 9, 20, 0.1)", border: "1px solid rgba(229, 9, 20, 0.2)" }}
        >
          <Film className="w-10 h-10" style={{ color: "var(--red-primary)" }} />
        </div>

        <h1 className="text-8xl font-black mb-4 text-gradient-red">404</h1>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Trang Không Tìm Thấy
        </h2>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Trang Chủ
          </Link>
          <Link href="/movies" className="btn-secondary">
            <Search className="w-4 h-4" />
            Tìm Phim
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
