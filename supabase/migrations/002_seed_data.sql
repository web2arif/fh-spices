-- ============================================================================
-- FH Spices — Seed Data
-- Run this AFTER 001_initial_schema.sql
-- 6 representative products spanning all categories
-- ============================================================================

-- ----------------------------------------------------------------------------
-- VEG PICKLES
-- ----------------------------------------------------------------------------

insert into products (slug, name, category, description, ingredients, shelf_life_days, is_seasonal, available_months, is_active)
values
  (
    'andhra-aavakaya',
    'Andhra Aavakaya',
    'veg_pickle',
    'The original Andhra mango pickle. Raw mango chunks cured in mustard oil, red chilli, fenugreek, and rock salt. Made the way our grandmothers made it — no preservatives, no shortcuts.',
    'Raw mango, mustard oil, red chilli powder, fenugreek, mustard seeds, rock salt, turmeric',
    365,
    true,
    array[4,5,6],  -- April-June mango season
    true
  ),
  (
    'gongura-pickle',
    'Gongura Pickle',
    'veg_pickle',
    'Telugu sorrel leaves slow-cooked with garlic and red chilli. Tangy, earthy, unmistakably Hyderabadi.',
    'Gongura leaves, garlic, red chilli, sesame oil, salt, turmeric',
    180,
    true,
    array[7,8,9,10],
    true
  );

-- ----------------------------------------------------------------------------
-- NON-VEG PICKLES
-- ----------------------------------------------------------------------------

insert into products (slug, name, category, description, ingredients, shelf_life_days, is_active)
values
  (
    'chicken-boneless-pickle',
    'Chicken Boneless Pickle',
    'non_veg_pickle',
    'Slow-cooked boneless chicken in a fiery masala of red chilli, garlic, and curry leaves. Travel-friendly, refrigerate after opening.',
    'Boneless chicken, red chilli, garlic, ginger, curry leaves, sesame oil, vinegar, salt, spices',
    90,
    true
  );

-- ----------------------------------------------------------------------------
-- PROTEIN SNACKS
-- ----------------------------------------------------------------------------

insert into products (slug, name, category, description, ingredients, shelf_life_days, is_active)
values
  (
    'flax-seed-laddu',
    'Flax Seed Laddu',
    'protein_snack',
    'Roasted flax seeds, jaggery, and ghee rolled into bite-sized laddus. Nutritious, no refined sugar.',
    'Flax seeds, jaggery, ghee, cardamom, cashew',
    60,
    true
  ),
  (
    'kaju-chikki',
    'Kaju Chikki',
    'protein_snack',
    'Freshly homemade cashew brittle. Slow-cooked jaggery, whole cashews, no preservatives.',
    'Cashews, jaggery, ghee',
    90,
    true
  );

-- ----------------------------------------------------------------------------
-- SPICE POWDERS
-- ----------------------------------------------------------------------------

insert into products (slug, name, category, description, ingredients, shelf_life_days, is_active)
values
  (
    'guntur-karam',
    'Guntur Karam',
    'spice_powder',
    'Stone-ground Guntur red chilli powder. Sharp, bright, the backbone of any South Indian kitchen.',
    'Guntur red chilli',
    365,
    true
  );

-- ----------------------------------------------------------------------------
-- VARIANTS — pack sizes per product
-- ----------------------------------------------------------------------------

-- Andhra Aavakaya: 250g, 500g, 1kg in medium and hot
insert into product_variants (product_id, pack_size_grams, price_inr, spice_level, sku, in_stock)
select id, 250, 200.00, 'medium', 'AAV-250-MED', true from products where slug = 'andhra-aavakaya'
union all
select id, 500, 380.00, 'medium', 'AAV-500-MED', true from products where slug = 'andhra-aavakaya'
union all
select id, 1000, 700.00, 'medium', 'AAV-1000-MED', true from products where slug = 'andhra-aavakaya'
union all
select id, 500, 380.00, 'hot', 'AAV-500-HOT', true from products where slug = 'andhra-aavakaya';

-- Gongura: 500g, 1kg
insert into product_variants (product_id, pack_size_grams, price_inr, spice_level, sku, in_stock)
select id, 500, 450.00, 'medium', 'GON-500-MED', true from products where slug = 'gongura-pickle'
union all
select id, 1000, 800.00, 'medium', 'GON-1000-MED', true from products where slug = 'gongura-pickle';

-- Chicken Boneless: 500g, 1kg
insert into product_variants (product_id, pack_size_grams, price_inr, spice_level, sku, in_stock)
select id, 500, 700.00, 'medium', 'CHB-500-MED', true from products where slug = 'chicken-boneless-pickle'
union all
select id, 1000, 1300.00, 'medium', 'CHB-1000-MED', true from products where slug = 'chicken-boneless-pickle'
union all
select id, 500, 700.00, 'hot', 'CHB-500-HOT', true from products where slug = 'chicken-boneless-pickle';

-- Flax Seed Laddu: 250g, 500g, 1kg
insert into product_variants (product_id, pack_size_grams, price_inr, sku, in_stock)
select id, 250, 220.00, 'FLX-250', true from products where slug = 'flax-seed-laddu'
union all
select id, 500, 420.00, 'FLX-500', true from products where slug = 'flax-seed-laddu'
union all
select id, 1000, 800.00, 'FLX-1000', true from products where slug = 'flax-seed-laddu';

-- Kaju Chikki: 250g, 500g
insert into product_variants (product_id, pack_size_grams, price_inr, sku, in_stock)
select id, 250, 320.00, 'KAJ-250', true from products where slug = 'kaju-chikki'
union all
select id, 500, 620.00, 'KAJ-500', true from products where slug = 'kaju-chikki';

-- Guntur Karam: 250g, 500g, 1kg
insert into product_variants (product_id, pack_size_grams, price_inr, sku, in_stock)
select id, 250, 140.00, 'GTR-250', true from products where slug = 'guntur-karam'
union all
select id, 500, 270.00, 'GTR-500', true from products where slug = 'guntur-karam'
union all
select id, 1000, 500.00, 'GTR-1000', true from products where slug = 'guntur-karam';

-- ----------------------------------------------------------------------------
-- A sample batch (for testing the inventory view)
-- ----------------------------------------------------------------------------

insert into batches (product_id, made_on, available_from, available_until, quantity_kg, quantity_remaining_kg, notes)
select id, current_date - 3, current_date - 1, current_date + 60, 50.00, 47.50, 'First test batch — May 2026'
from products where slug = 'andhra-aavakaya';
