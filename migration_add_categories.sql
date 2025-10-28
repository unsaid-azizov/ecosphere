-- Migration to add multiple categories support to products
-- WARNING: This will modify your database schema. Make a backup first!

-- Step 1: Add the new categories column (array of text)
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Step 2: Migrate existing single category data to the categories array
-- This copies the old category field into the new categories array
UPDATE products
SET categories = ARRAY[category]
WHERE category IS NOT NULL AND category != '' AND (categories IS NULL OR cardinality(categories) = 0);

-- Step 3: Ensure all products have at least an empty array (not NULL)
UPDATE products
SET categories = '{}'
WHERE categories IS NULL;

-- Step 4: After verification, you can drop the old category column
-- IMPORTANT: Only run this after you've verified that all data has been migrated correctly!
-- ALTER TABLE products DROP COLUMN IF EXISTS category;

-- Step 5: Update OrderItems table to support multiple categories
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}';

-- Step 6: Migrate existing order item category data
UPDATE order_items
SET product_categories = ARRAY[product_category]
WHERE product_category IS NOT NULL AND product_category != '' AND (product_categories IS NULL OR cardinality(product_categories) = 0);

-- Step 7: Ensure all order items have at least an empty array
UPDATE order_items
SET product_categories = '{}'
WHERE product_categories IS NULL;

-- Step 8: After verification, drop the old column from order_items
-- IMPORTANT: Only run this after you've verified that all data has been migrated correctly!
-- ALTER TABLE order_items DROP COLUMN IF EXISTS product_category;

-- Verify the migration
SELECT
    id,
    name,
    categories,
    (SELECT count(*) FROM unnest(categories)) as category_count
FROM products
LIMIT 10;
