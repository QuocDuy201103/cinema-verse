"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GoatModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show the modal every time the page is loaded/refreshed
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChoose = (player: string) => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header pattern */}
            <div
              className="h-24 w-full relative overflow-hidden flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--red-primary) 0%, #4f0000 100%)",
              }}
            >
              <h2 className="text-2xl font-black text-white relative z-10 tracking-wide uppercase">
                Giải Trí Chút Nhé!
              </h2>
              {/* Abstract shapes */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/20 rounded-full blur-2xl translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="p-6 text-center">
              <p className="text-lg font-medium mb-6" style={{ color: "var(--text-primary)" }}>
                Theo bạn, ai là <strong style={{ color: "var(--red-primary)" }}>G.O.A.T</strong> (Cầu thủ xuất sắc nhất mọi thời đại)?
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoose("Messi")}
                  className="flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors relative overflow-hidden group"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-4xl">GOAT</span>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>Lionel Messi</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoose("Ronaldo")}
                  className="flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors relative overflow-hidden group"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-4xl">NO GOAT</span>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>Cristiano Ronaldo</span>
                </motion.button>
              </div>

              <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
                *Lựa chọn của bạn sẽ được giữ bí mật và chỉ mang tính chất vui vẻ!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
