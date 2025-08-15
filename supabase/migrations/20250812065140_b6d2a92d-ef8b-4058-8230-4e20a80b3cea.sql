-- CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Public read access for categories
drop policy if exists "Categories are publicly readable" on public.categories;
create policy "Categories are publicly readable" on public.categories for select using (true);

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique,
  description text,
  price numeric(12,2) not null,
  original_price numeric(12,2),
  rating numeric(2,1) default 0,
  reviews_count integer default 0,
  stock integer default 0,
  discount integer,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable" on public.products for select using (true);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_created_at on public.products(created_at desc);

-- PRODUCT IMAGES
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  position integer default 0,
  created_at timestamptz not null default now()
);

alter table public.product_images enable row level security;

drop policy if exists "Product images are publicly readable" on public.product_images;
create policy "Product images are publicly readable" on public.product_images for select using (true);

create index if not exists idx_product_images_product on public.product_images(product_id);

-- CARTS (one per user)
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.carts enable row level security;

drop policy if exists "Users can manage their own cart" on public.carts;
create policy "Users can manage their own cart" on public.carts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- CART ITEMS
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, product_id)
);

alter table public.cart_items enable row level security;

drop policy if exists "Users can view their own cart items" on public.cart_items;
create policy "Users can view their own cart items" on public.cart_items
  for select using (exists (
    select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()
  ));

drop policy if exists "Users can modify their own cart items" on public.cart_items;
create policy "Users can modify their own cart items" on public.cart_items
  for all using (exists (
    select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()
  ));

-- triggers for timestamps
drop trigger if exists update_products_updated_at on public.products;
create trigger update_products_updated_at before update on public.products for each row execute function public.update_updated_at_column();

drop trigger if exists update_carts_updated_at on public.carts;
create trigger update_carts_updated_at before update on public.carts for each row execute function public.update_updated_at_column();

drop trigger if exists update_cart_items_updated_at on public.cart_items;
create trigger update_cart_items_updated_at before update on public.cart_items for each row execute function public.update_updated_at_column();