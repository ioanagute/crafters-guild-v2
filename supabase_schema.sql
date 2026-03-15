-- ====================================================================================
-- THE ARTISANS' GUILD - SUPABASE SCHEMA
-- Paste this entire file into the Supabase SQL Editor and click "Run"
-- ====================================================================================

-- 1. EXTENSION SETUP
-- Enable pgcrypto for generating UUIDs
create extension if not exists pgcrypto;

-- ====================================================================================
-- 2. TABLES CREATION
-- ====================================================================================

-- PROFILES (Heraldry)
-- Extends the default Supabase auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('artisan', 'patron', 'apprentice')) default 'patron',
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GUILDS 
create table public.guilds (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  emblem_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS (The Grand Bazaar)
create table public.products (
  id uuid default gen_random_uuid() primary key,
  crafter_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric not null,
  currency text default 'Gold' not null,
  category text check (category in ('Apparel', 'Weaponry', 'Armor', 'Consumable', 'Magic', 'Tool', 'Other')) default 'Other',
  image_url text,
  stock integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- POSTS (The Noticeboard)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  tier_required text check (tier_required in ('Public', 'Copper', 'Iron', 'Gold')) default 'Public',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ====================================================================================
-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- ====================================================================================
-- Whenever a new user signs up via Supabase Auth, automatically create a blank profile 
-- for them in the public.profiles table.

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'patron')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ====================================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================================
-- This ensures users can only edit their own data, but can view public data.

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.guilds enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone." 
  on profiles for select using (true);

create policy "Users can insert their own profile." 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on profiles for update using (auth.uid() = id);

-- GUILDS POLICIES
create policy "Guilds are viewable by everyone." 
  on guilds for select using (true);

-- PRODUCTS POLICIES
create policy "Products are viewable by everyone." 
  on products for select using (true);

create policy "Only artisans can insert products." 
  on products for insert with check (
    auth.uid() = crafter_id AND 
    exists (select 1 from profiles where id = auth.uid() and role = 'artisan')
  );

create policy "Crafters can update their own products." 
  on products for update using (auth.uid() = crafter_id);

create policy "Crafters can delete their own products." 
  on products for delete using (auth.uid() = crafter_id);

-- POSTS POLICIES
create policy "Public posts are viewable by everyone." 
  on posts for select using (true); 
  -- Note: A more advanced policy would check the user's patron tier vs the post's tier_required.
  -- Kept fully public for the baseline version.

create policy "Users can create posts." 
  on posts for insert with check (auth.uid() = author_id);

create policy "Users can update their own posts." 
  on posts for update using (auth.uid() = author_id);

create policy "Users can delete their own posts." 
  on posts for delete using (auth.uid() = author_id);
