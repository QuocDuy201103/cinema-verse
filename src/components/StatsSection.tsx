"use client";

import { motion } from "framer-motion";
import { Film, Users, Star, Globe } from "lucide-react";

const stats = [
  { icon: Film, value: "10,000+", label: "Bộ Phim", color: "var(--red-primary)" },
  { icon: Users, value: "5M+", label: "Người Dùng", color: "#6366f1" },
  { icon: Star, value: "4.8/5", label: "Đánh Giá TB", color: "#f59e0b" },
  { icon: Globe, value: "50+", label: "Quốc Gia", color: "#10b981" },
];

export default function StatsSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-4">
      <div
        className="rounded-2xl p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(229, 9, 20, 0.08) 0%, rgba(20, 20, 20, 0.9) 50%, rgba(99, 102, 241, 0.08) 100%)",
          border: "1px solid rgba(229, 9, 20, 0.2)",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${color}22`, border: `1px solid ${color}44` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <span className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-primary)" }}>
                {value}
              </span>
              <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
