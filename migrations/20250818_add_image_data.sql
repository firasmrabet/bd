-- Migration: add image_data bytea columns and migrate base64 data-URLs
-- This migration will:
-- 1) add a non-destructive `image_data` column (bytea) to `custom_products` and `custom_categories` if missing
-- 2) convert any existing `image` values that are data-URLs (data:<mime>;base64,<data>) into binary and store in `image_data`
-- IMPORTANT: this script only converts images stored as data-URLs (base64). If your `image` column contains public URLs,
-- the URL values are left untouched. Review and backup before running.

BEGIN;

-- Add columns (non-destructive)
ALTER TABLE IF EXISTS custom_products ADD COLUMN IF NOT EXISTS image_data bytea;
ALTER TABLE IF EXISTS custom_categories ADD COLUMN IF NOT EXISTS image_data bytea;

-- Convert data-URL base64 strings in `image` to bytea stored in `image_data`.
-- Matches strings starting with 'data:...;base64,' and decodes the trailing base64 portion.
UPDATE custom_products
SET image_data = decode(regexp_replace(image, '^data:[^;]+;base64,', ''), 'base64')
WHERE image IS NOT NULL AND image LIKE 'data:%;base64,%';

UPDATE custom_categories
SET image_data = decode(regexp_replace(image, '^data:[^;]+;base64,', ''), 'base64')
WHERE image IS NOT NULL AND image LIKE 'data:%;base64,%';

COMMIT;

-- Test queries (run separately in SQL editor to verify results):
-- SELECT count(*) AS products_with_image_data FROM custom_products WHERE image_data IS NOT NULL;
-- SELECT count(*) AS categories_with_image_data FROM custom_categories WHERE image_data IS NOT NULL;

-- Optional: if you later want to remove the old `image` text column once you're confident, do so after backup:
-- ALTER TABLE custom_products DROP COLUMN image;
-- ALTER TABLE custom_categories DROP COLUMN image;
