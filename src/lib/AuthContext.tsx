"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  username: string;
  avatar_icon: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string, avatarIcon: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUserId = localStorage.getItem("cinemaverse_user_id");
    if (storedUserId) {
      fetchUser(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("cinemaverse_user_id");
      } else if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, avatarIcon: string) => {
    setLoading(true);
    try {
      // Create new profile
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ username, avatar_icon: avatarIcon }])
        .select()
        .single();

      if (error) {
        // If username exists (assuming UNIQUE constraint), maybe we can just login?
        // For simplicity, we just fetch it if it exists.
        if (error.code === '23505') { // Postgres unique violation
           const { data: existingData, error: fetchErr } = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username)
            .single();
            
           if (existingData) {
             // Update avatar just in case they picked a new one
             const { data: updatedData } = await supabase
               .from("profiles")
               .update({ avatar_icon: avatarIcon })
               .eq("id", existingData.id)
               .select()
               .single();
               
             setUser(updatedData || existingData);
             localStorage.setItem("cinemaverse_user_id", existingData.id);
             return;
           }
        }
        throw error;
      }

      if (data) {
        setUser(data);
        localStorage.setItem("cinemaverse_user_id", data.id);
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cinemaverse_user_id");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
