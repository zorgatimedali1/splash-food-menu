-- Add is_bestseller column to products
ALTER TABLE products ADD COLUMN is_bestseller INTEGER DEFAULT 0;

-- Mark some products as bestsellers
UPDATE products SET is_bestseller = 1 WHERE name = 'Chawarma' AND category_id = 1;
UPDATE products SET is_bestseller = 1 WHERE name = 'Splash Pizza';
UPDATE products SET is_bestseller = 1 WHERE name = 'Splash Tacos';
UPDATE products SET is_bestseller = 1 WHERE name = 'Cordon Bleu' AND category_id = 3;
UPDATE products SET is_bestseller = 1 WHERE name = 'Spaghetti Bolognaise';
UPDATE products SET is_bestseller = 1 WHERE name = 'Poulet' AND category_id = 13;
