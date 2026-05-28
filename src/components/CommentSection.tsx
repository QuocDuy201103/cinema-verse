"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { User as UserIcon, Cat, Dog, Ghost, Smile, Rocket, Star, Zap, Heart, Bot } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ICON_MAP: Record<string, any> = {
  user: UserIcon, cat: Cat, dog: Dog, ghost: Ghost, smile: Smile,
  rocket: Rocket, star: Star, zap: Zap, heart: Heart, bot: Bot
};

interface Comment {
  id: string;
  movie_slug: string;
  episode_name: string | null;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_icon: string;
  };
}

interface Props {
  movieSlug: string;
  currentEpisodeName?: string;
  onRequireLogin: () => void;
}

export default function CommentSection({ movieSlug, currentEpisodeName, onRequireLogin }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel("public:comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `movie_slug=eq.${movieSlug}` }, (payload) => {
        fetchComments(); // Simplest way to get full profile data joined
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [movieSlug]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id, movie_slug, episode_name, content, created_at,
          profiles (id, username, avatar_icon)
        `)
        .eq("movie_slug", movieSlug)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data as any);
    } catch (err) {
      console.error("Error fetching comments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert([{
          movie_slug: movieSlug,
          episode_name: currentEpisodeName || null,
          profile_id: user.id,
          content: newComment.trim(),
        }]);

      if (error) throw error;
      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Error posting comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    try {
      const { error } = await supabase.from("comments").delete().eq("id", id).eq("profile_id", user?.id);
      if (error) throw error;
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(229, 9, 20, 0.1)" }}>
          <MessageSquare className="w-5 h-5" style={{ color: "var(--red-primary)" }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Bình Luận ({comments.length})
        </h2>
      </div>

      {/* Input Form */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold"
              style={{ background: "var(--red-primary)", color: "white" }}>
              {ICON_MAP[user.avatar_icon] ? (() => {
                const IconComponent = ICON_MAP[user.avatar_icon];
                return <IconComponent className="w-5 h-5" />;
              })() : user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim này..."
                className="w-full bg-transparent outline-none resize-none min-h-[40px] text-sm py-2"
                style={{ color: "var(--text-primary)" }}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
              <div className="flex justify-end mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: "var(--red-primary)", color: "white" }}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Gửi bình luận
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
              Vui lòng đăng nhập để có thể bình luận.
            </p>
            <button
              onClick={onRequireLogin}
              className="px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              style={{ background: "var(--red-primary)", color: "white" }}
            >
              Đăng Nhập Ngay
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--red-primary)" }} />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold"
                style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                {ICON_MAP[comment.profiles?.avatar_icon || "user"] ? (() => {
                  const IconComponent = ICON_MAP[comment.profiles?.avatar_icon || "user"];
                  return <IconComponent className="w-5 h-5" />;
                })() : comment.profiles?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                      {comment.profiles?.username || "Ẩn danh"}
                    </span>
                    {comment.episode_name && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: "rgba(229, 9, 20, 0.1)", color: "var(--red-primary)" }}>
                        {comment.episode_name}
                      </span>
                    )}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      • {dayjs(comment.created_at).fromNow()}
                    </span>
                  </div>
                  
                  {user?.id === comment.profiles?.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                      style={{ color: "var(--text-muted)" }}
                      title="Xóa bình luận"
                    >
                      <Trash2 className="w-4 h-4 hover:text-red-500" />
                    </button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap break-words" style={{ color: "var(--text-secondary)" }}>
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 rounded-2xl" style={{ border: "1px dashed var(--border)" }}>
            <p style={{ color: "var(--text-muted)" }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
}
