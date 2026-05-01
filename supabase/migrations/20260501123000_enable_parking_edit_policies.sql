alter table public.parkings enable row level security;
alter table public.parking_photos enable row level security;

drop policy if exists "Authenticated can update parkings" on public.parkings;
create policy "Authenticated can update parkings"
on public.parkings
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Allow public select on parking photos" on public.parking_photos;
create policy "Allow public select on parking photos"
on public.parking_photos
for select
to public
using (true);

drop policy if exists "Authenticated can create parking photos" on public.parking_photos;
create policy "Authenticated can create parking photos"
on public.parking_photos
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can delete parking photos" on public.parking_photos;
create policy "Authenticated can delete parking photos"
on public.parking_photos
for delete
to authenticated
using (true);
