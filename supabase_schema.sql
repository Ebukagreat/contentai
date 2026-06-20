create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text, email text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro')),
  credits integer default 5,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, prompt text not null, output text not null,
  word_count integer default 0, created_at timestamptz default now()
);
alter table public.generations enable row level security;
create policy "Users can view own generations" on public.generations for select using (auth.uid() = user_id);
create policy "Users can insert own generations" on public.generations for insert with check (auth.uid() = user_id);

create or replace function public.use_credit(user_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.profiles set credits = credits - 1 where id = user_id and credits > 0;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, plan, credits)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'User'), new.email, 'free', 5)
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
