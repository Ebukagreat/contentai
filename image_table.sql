-- Run this in Supabase SQL Editor to add image generation support

create table if not exists public.image_generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt text not null,
  image_url text,
  created_at timestamptz default now()
);

alter table public.image_generations enable row level security;

create policy "Users can view own images"
  on public.image_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own images"
  on public.image_generations for insert
  with check (auth.uid() = user_id);
