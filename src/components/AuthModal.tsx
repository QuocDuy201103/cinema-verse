"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Cat, Dog, Ghost, Smile, Rocket, Star, Zap, Heart, Bot } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const AVATAR_OPTIONS = [
  { id: "user", icon: User, color: "#3b82f6" },
  { id: "cat", icon: Cat, color: "#f59e0b" },
  { id: "dog", icon: Dog, color: "#10b981" },
  { id: "ghost", icon: Ghost, color: "#8b5cf6" },
  { id: "smile", icon: Smile, color: "#eab308" },
  { id: "rocket", icon: Rocket, color: "#ef4444" },
  { id: "star", icon: Star, color: "#facc15" },
  { id: "zap", icon: Zap, color: "#f97316" },
  { id: "heart", icon: Heart, color: "#ec4899" },
  { id: "bot", icon: Bot, color: "#06b6d4" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("user");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Vui lòng nhập tên hiển thị");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await login(username.trim(), selectedAvatar);
      onClose();
    } catch (err: any) {
      setError("Có lỗi xảy ra. Tên này có thể đã được sử dụng, vui lòng chọn tên khác.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Tạo Tài Khoản Nhanh
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Chọn một avatar và nhập tên để tham gia bình luận cùng mọi người.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                    Chọn Avatar
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {AVATAR_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedAvatar === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedAvatar(opt.id)}
                          className="flex items-center justify-center aspect-square rounded-xl transition-all"
                          style={{
                            background: isSelected ? `${opt.color}20` : "var(--bg-card)",
                            border: `2px solid ${isSelected ? opt.color : "var(--border)"}`,
                            color: isSelected ? opt.color : "var(--text-secondary)"
                          }}
                        >
                          <Icon className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                    Tên hiển thị
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--red-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                    maxLength={30}
                  />
                  {error && (
                    <p className="mt-2 text-sm" style={{ color: "var(--red-primary)" }}>
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{
                    background: "var(--red-primary)",
                    color: "white"
                  }}
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Bắt Đầu Bình Luận"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
