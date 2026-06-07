-- Remove duplicate products (keep lowest id per category_id + name)
DELETE FROM products WHERE id NOT IN (
  SELECT MIN(id) FROM products GROUP BY category_id, name
);

-- Fix image URLs using category images
UPDATE products SET image_url = (SELECT c.image_url FROM categories c WHERE c.id = products.category_id)
WHERE image_url IS NULL OR image_url = '' OR image_url LIKE '/images/%';
