-- Seed: Admin user (password: splashfood2026)
INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES
  ('admin@splashfood.tn', '$2b$12$sYjWJ3T8am9aU94kIFvane5ReVzv76LmG9UZSBJscMq6mJI9AQrFm', 'Admin', 'admin');

-- Seed: Categories
INSERT OR IGNORE INTO categories (name, description, image_url, sort_order) VALUES
  ('TABOUNA', 'Tabounas farcies, pains traditionnels tunisiens garnis', '/images/tabouna photo.jpg', 1),
  ('CORNET', 'Cornets croustillants généreusement garnis', '/images/cornet photo.jpeg', 2),
  ('CALZONE', 'Calzone farcis au fromage fondant', '/images/pizza-calzone.jpg', 3),
  ('LIBANAIS', 'Sandwichs libanais aux saveurs orientales', '/images/splash_sandwich.jpg', 4),
  ('CIABATTA', 'Ciabattas grillées à l''italienne', '/images/cibatta photo.jpg', 5),
  ('MAKLOUB', 'Makloubs retournés, croustillants et savoureux', '/images/makloub photo.jpg', 6),
  ('PIZZA', 'Pizzas artisanales cuites au four traditionnel', '/images/splash_pizza.jpg', 7),
  ('TRIANGLE', 'Triangles dorés et croustillants', '/images/triangle photo.png', 8),
  ('BAGUETTE FARCIE', 'Baguettes farcies généreusement garnies', '/images/baguette farce.jpg', 9),
  ('TACOS', 'Tacos garnis de viandes et fromage fondant', '/images/tacos phoyo.jpg', 10),
  ('PÂTES', 'Pâtes italiennes préparées maison', '/images/pate.png', 11),
  ('SALADES', 'Salades fraîches et croquantes', '/images/splash_salade.jpg', 12),
  ('LES PLATS', 'Plats principaux et grillades maison', '/images/poulet_croustillant.jpg', 13),
  ('OMELETTE', 'Omelettes aux œufs frais', '/images/splash_omelette.jpg', 14),
  ('BOISSONS', 'Boissons fraîches et rafraîchissements', '/images/splash_boissons.jpg', 15);

-- Seed: Supplements
INSERT OR IGNORE INTO supplements (name, price, is_active) VALUES
  ('Fromage', 2.0, 1), ('Olives', 1.0, 1), ('Tomates', 1.0, 1), ('Oignons', 1.0, 1),
  ('Sauce Blanche', 1.0, 1), ('Harissa', 0.5, 1), ('Cornichons', 1.0, 1), ('Champignons', 2.0, 1);

-- Seed: Site settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
  ('whatsapp_number', '+21699744593'),
  ('delivery_fee', '2'),
  ('restaurant_address', 'Avenue 14 Janvier, Kalaa Kebira 4060'),
  ('opening_hours', 'Lun-Dim: 11h - 23h');
