export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      guilds: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          emblem_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          emblem_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          emblem_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_guild_id_fkey";
            columns: ["id"];
            referencedRelation: "profiles";
            referencedColumns: ["guild_id"];
          },
        ];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          tier_required: "Public" | "Copper" | "Iron" | "Gold";
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          content: string;
          tier_required?: "Public" | "Copper" | "Iron" | "Gold";
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          content?: string;
          tier_required?: "Public" | "Copper" | "Iron" | "Gold";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          crafter_id: string;
          title: string;
          description: string | null;
          price: number;
          currency: string;
          category: "Apparel" | "Weaponry" | "Armor" | "Consumable" | "Magic" | "Tool" | "Other";
          image_url: string | null;
          stock: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          crafter_id: string;
          title: string;
          description?: string | null;
          price: number;
          currency?: string;
          category?: "Apparel" | "Weaponry" | "Armor" | "Consumable" | "Magic" | "Tool" | "Other";
          image_url?: string | null;
          stock?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          crafter_id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          category?: "Apparel" | "Weaponry" | "Armor" | "Consumable" | "Magic" | "Tool" | "Other";
          image_url?: string | null;
          stock?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_crafter_id_fkey";
            columns: ["crafter_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "artisan" | "patron" | "apprentice" | null;
          bio: string | null;
          guild_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "artisan" | "patron" | "apprentice" | null;
          bio?: string | null;
          guild_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "artisan" | "patron" | "apprentice" | null;
          bio?: string | null;
          guild_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_guild_id_fkey";
            columns: ["guild_id"];
            referencedRelation: "guilds";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
