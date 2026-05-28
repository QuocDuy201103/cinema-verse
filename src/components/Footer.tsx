"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Play, MessageCircle, Heart, Star, Mail } from "lucide-react";

export default function Footer() {
  const links = {
    "Khám Phá": [
      { label: "Trang Chủ", href: "/" },
      { label: "Danh Sách Phim", href: "/phim" },
      { label: "Phim Đang Chiếu", href: "/phim" },
      { label: "Phim Mới Nhất", href: "/phim" },
    ],
    "Thể Loại": [
      { label: "Hành Động", href: "/phim?genre=hanh-dong" },
      { label: "Tình Cảm", href: "/phim?genre=tinh-cam" },
      { label: "Cổ Trang", href: "/phim?genre=co-trang" },
      { label: "Kinh Dị", href: "/phim?genre=kinh-di" },
    ],
    "Hỗ Trợ": [

      { label: "Liên Hệ", href: "#" },
      { label: "Câu Hỏi Thường Gặp", href: "#" },
      { label: "Chính Sách Bảo Mật", href: "#" },
      { label: "Điều Khoản Dịch Vụ", href: "#" },
    ],
  };

  const socials = [
    { Icon: Play, label: "YouTube", href: "#" },
    { Icon: MessageCircle, label: "Twitter", href: "#" },
    { Icon: Heart, label: "Instagram", href: "#" },
    { Icon: Star, label: "GitHub", href: "#" },
  ];

  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--red-primary)" }}
              >
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                Cinema<span style={{ color: "var(--red-primary)" }}>Verse</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--text-muted)" }}>
              Trải nghiệm điện ảnh đỉnh cao với kho phim khổng lồ. Xem phim HD & 4K mọi lúc, mọi nơi.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3
                className="font-bold text-sm mb-4 uppercase tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        {/* <div
          className="mt-12 p-6 rounded-2xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h4 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                📧 Đăng ký nhận thông báo phim mới
              </h4>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Nhận thông báo khi có phim mới mỗi tuần.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="search-input"
                  id="newsletter-email"
                />
              </div>
              <button className="btn-primary shrink-0 py-2.5 px-5 text-sm">
                Đăng Ký
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2024 CinemaVerse. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6">
            {["Chính Sách Bảo Mật", "Điều Khoản", "Cookie"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-xs transition-colors hover:text-white"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
