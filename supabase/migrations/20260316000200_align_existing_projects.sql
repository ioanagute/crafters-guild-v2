create extension if not exists pgcrypto;

create table if not exists public.guilds (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  emblem_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table if exists public.profiles
  add column if not exists guild_id uuid references public.guilds(id) on delete set null;

alter table if exists public.profiles
  add column if not exists bio text;

alter table if exists public.profiles
  add column if not exists avatar_url text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
  ) then
    begin
      alter table public.profiles
        drop constraint if exists profiles_role_check;
    exception
      when undefined_table then null;
    end;

    alter table public.profiles
      alter column role set default 'patron';

    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('artisan', 'patron', 'apprentice'));
  end if;
end
$$;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'patron')
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;

alter table if exists public.profiles enable row level security;
alter table if exists public.guilds enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public profiles are viewable by everyone.'
  ) then
    create policy "Public profiles are viewable by everyone."
      on public.profiles for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert their own profile.'
  ) then
    create policy "Users can insert their own profile."
      on public.profiles for insert with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile.'
  ) then
    create policy "Users can update own profile."
      on public.profiles for update using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'guilds' and policyname = 'Guilds are viewable by everyone.'
  ) then
    create policy "Guilds are viewable by everyone."
      on public.guilds for select using (true);
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'products'
  ) then
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'products' and policyname = 'Products are viewable by everyone.'
    ) then
      create policy "Products are viewable by everyone."
        on public.products for select using (true);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'products' and policyname = 'Only artisans can insert products.'
    ) then
      create policy "Only artisans can insert products."
        on public.products for insert with check (
          auth.uid() = crafter_id and
          exists (
            select 1
            from public.profiles
            where id = auth.uid() and role = 'artisan'
          )
        );
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'products' and policyname = 'Crafters can update their own products.'
    ) then
      create policy "Crafters can update their own products."
        on public.products for update using (auth.uid() = crafter_id);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'products' and policyname = 'Crafters can delete their own products.'
    ) then
      create policy "Crafters can delete their own products."
        on public.products for delete using (auth.uid() = crafter_id);
    end if;
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'posts'
  ) then
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'posts' and policyname = 'Public posts are viewable by everyone.'
    ) then
      create policy "Public posts are viewable by everyone."
        on public.posts for select using (true);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'posts' and policyname = 'Users can create posts.'
    ) then
      create policy "Users can create posts."
        on public.posts for insert with check (auth.uid() = author_id);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'posts' and policyname = 'Users can update their own posts.'
    ) then
      create policy "Users can update their own posts."
        on public.posts for update using (auth.uid() = author_id);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'posts' and policyname = 'Users can delete their own posts.'
    ) then
      create policy "Users can delete their own posts."
        on public.posts for delete using (auth.uid() = author_id);
    end if;
  end if;
end
$$;
