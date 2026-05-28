import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoatModal from "@/components/GoatModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CinemaVerse",
    default: "CinemaVerse – Xem Phim Trực Tuyến Chất Lượng Cao",
  },
  description:
    "Khám phá hàng nghìn bộ phim chất lượng cao với trải nghiệm xem phim đỉnh cao. CinemaVerse – nơi điện ảnh gặp gỡ công nghệ.",
  keywords: ["xem phim", "phim online", "phim HD", "phim mới", "rạp chiếu phim trực tuyến"],
  authors: [{ name: "CinemaVerse" }],
  openGraph: {
    type: "website",
    siteName: "CinemaVerse",
    title: "CinemaVerse – Xem Phim Trực Tuyến Chất Lượng Cao",
    description: "Khám phá hàng nghìn bộ phim chất lượng cao với trải nghiệm xem phim đỉnh cao.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoatModal />
      </body>
    </html>
  );
}
