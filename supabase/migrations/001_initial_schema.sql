-- ============================================================================
-- FH Spices — Initial Schema Migration
-- Run this in Supabase SQL Editor (Project → SQL Editor → New Query → paste → Run)
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- CATALOG
-- ----------------------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in (
    'veg_pickle','non_veg_pickle','protein_snack','spice_powder','ghee','other'
  )),
  description text,
  ingredients text,
  shelf_life_days int,
  is_seasonal boolean default false,
  available_months int[] default null,
  hero_image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_products_category on products(category);
create index idx_products_active on products(is_active) where is_active = true;

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  pack_size_grams int not null,
  price_inr numeric(8,2) not null,
  spice_level text check (spice_level in ('mild','medium','hot','extra_hot')),
  sku text unique,
  in_stock boolean default true
);

create index idx_variants_product on product_variants(product_id);

create table batches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  made_on date,
  available_from date,
  available_until date,
  quantity_kg numeric(6,2),
  quantity_remaining_kg numeric(6,2),  -- decrements as orders are placed
  notes text
);

create index idx_batches_product on batches(product_id);

-- ----------------------------------------------------------------------------
-- CUSTOMERS
-- ----------------------------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text unique not null,
  name text,
  email text,
  default_address jsonb,
  first_seen_at timestamptz default now(),
  total_orders int default 0,
  total_spent_inr numeric(10,2) default 0,
  last_order_at timestamptz,
  tags text[]
);

create index idx_customers_whatsapp on customers(whatsapp_number);
create index idx_customers_last_order on customers(last_order_at);

-- ----------------------------------------------------------------------------
-- ORDERS
-- ----------------------------------------------------------------------------

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id),
  status text not null default 'new' check (status in (
    'new','confirmed','preparing','packed','shipped','delivered','cancelled'
  )),
  channel text default 'whatsapp' check (channel in (
    'whatsapp','website','phone','direct'
  )),
  subtotal_inr numeric(10,2) not null,
  shipping_inr numeric(8,2) default 0,
  total_inr numeric(10,2) not null,
  payment_method text check (payment_method in ('upi','razorpay','cod')),
  payment_status text default 'pending' check (payment_status in (
    'pending','paid','refunded','failed'
  )),
  shipping_address jsonb,
  shiprocket_awb text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_customer on orders(customer_id);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  variant_id uuid references product_variants(id),
  product_name text not null,
  pack_size_grams int not null,
  quantity int not null,
  unit_price_inr numeric(8,2) not null,
  line_total_inr numeric(10,2) not null,
  customisations jsonb default '{}'::jsonb  -- { spice_level: 'extra_hot', oil: 'sesame', notes: '...' }
);

create index idx_order_items_order on order_items(order_id);

-- ----------------------------------------------------------------------------
-- CONVERSATIONS (chatbot memory)
-- ----------------------------------------------------------------------------

create table conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  whatsapp_number text not null,
  current_flow text,
  flow_state jsonb default '{}'::jsonb,
  last_message_at timestamptz default now(),
  agent_takeover boolean default false
);

create index idx_conversations_whatsapp on conversations(whatsapp_number);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  direction text check (direction in ('inbound','outbound')),
  content text,
  message_type text,
  whatsapp_message_id text,
  template_name text,
  is_billable boolean default false,
  created_at timestamptz default now()
);

create index idx_messages_conversation on messages(conversation_id, created_at);

-- ----------------------------------------------------------------------------
-- CAMPAIGNS & EVENTS
-- ----------------------------------------------------------------------------

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_name text not null,
  segment_query jsonb,
  sent_count int default 0,
  delivered_count int default 0,
  reply_count int default 0,
  conversion_count int default 0,
  cost_inr numeric(10,2) default 0,
  sent_at timestamptz
);

create table events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  customer_id uuid references customers(id),
  product_id uuid references products(id),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_events_type_created on events(event_type, created_at desc);
create index idx_events_customer on events(customer_id);

-- ----------------------------------------------------------------------------
-- TRIGGER: keep customers.total_orders / total_spent_inr / last_order_at fresh
-- Only counts paid, non-cancelled orders.
-- ----------------------------------------------------------------------------

create or replace function refresh_customer_totals()
returns trigger as $$
declare
  target_customer uuid;
begin
  -- Figure out which customer to recalculate
  if (tg_op = 'DELETE') then
    target_customer := old.customer_id;
  else
    target_customer := new.customer_id;
  end if;

  if target_customer is null then
    return coalesce(new, old);
  end if;

  update customers c
  set
    total_orders = (
      select count(*) from orders o
      where o.customer_id = target_customer
        and o.payment_status = 'paid'
        and o.status != 'cancelled'
    ),
    total_spent_inr = coalesce((
      select sum(total_inr) from orders o
      where o.customer_id = target_customer
        and o.payment_status = 'paid'
        and o.status != 'cancelled'
    ), 0),
    last_order_at = (
      select max(created_at) from orders o
      where o.customer_id = target_customer
        and o.payment_status = 'paid'
        and o.status != 'cancelled'
    )
  where c.id = target_customer;

  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger trg_orders_refresh_customer_totals
after insert or update or delete on orders
for each row execute function refresh_customer_totals();

-- ----------------------------------------------------------------------------
-- TRIGGER: auto-update orders.updated_at
-- ----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_orders_updated_at
before update on orders
for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- DONE
-- ----------------------------------------------------------------------------
