create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    'patron'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;
