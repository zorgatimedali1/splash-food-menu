-- Seed: All 106 products from the frontend data
-- Categories already seeded with sort_order 1-15
-- TABOUNA=1, CORNET=2, CALZONE=3, LIBANAIS=4, CIABATTA=5, MAKLOUB=6,
-- PIZZA=7, TRIANGLE=8, BAGUETTE FARCIE=9, TACOS=10, PÂTES=11,
-- SALADES=12, LES PLATS=13, OMELETTE=14, BOISSONS=15

-- TABOUNA (category_id=1)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(1, 'Thon', 'Tabouna garnie de thon émietté, olives vertes et tomates fraîches', 10.0, '/images/tabouna photo.jpg', 1),
(1, 'Escalope Grillée', 'Escalope de poulet grillée aux herbes, salade croquante, sauce maison', 12.0, '/images/tabouna photo.jpg', 2),
(1, 'Escalope Panée', 'Escalope de poulet panée croustillante, légumes frais, sauce au choix', 12.0, '/images/tabouna photo.jpg', 3),
(1, 'Chawarma', 'Poulet chawarma mariné, sauce blanche onctueuse, salade croquante', 12.0, '/images/tabouna photo.jpg', 4),
(1, 'Cordon Bleu', 'Cordon bleu fondant au fromage et jambon, sauce fromagère', 12.0, '/images/tabouna photo.jpg', 5),
(1, 'Viande Hachée', 'Viande hachée grillée aux épices, oignons caramélisés, salade', 11.0, '/images/tabouna photo.jpg', 6),
(1, 'Poulet', 'Poulet grillé tendre, salade fraîche, sauce au choix', 11.0, '/images/tabouna photo.jpg', 7),
(1, 'Merguez', 'Merguez grillées, poivrons sautés, sauce harissa maison', 9.0, '/images/tabouna photo.jpg', 8);

-- CORNET (category_id=2)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(2, 'Thon', 'Cornet croustillant au thon, olives vertes, salade, sauce citronnée', 12.0, '/images/cornet photo.jpeg', 1),
(2, 'Escalope Grillée', 'Cornet garni d''escalope de poulet grillée, crudités croquantes', 14.0, '/images/cornet photo.jpeg', 2),
(2, 'Escalope Panée', 'Cornet croustillant, escalope panée dorée, sauce maison', 14.0, '/images/cornet photo.jpeg', 3),
(2, 'Chawarma', 'Cornet chawarma, poulet mariné, sauce blanche, salade', 14.0, '/images/cornet photo.jpeg', 4),
(2, 'Cordon Bleu', 'Cornet au cordon bleu, fromage fondant, salade verte', 14.0, '/images/cornet photo.jpeg', 5),
(2, 'Viande Hachée', 'Cornet à la viande hachée épicée, oignons, tomates', 13.0, '/images/cornet photo.jpeg', 6),
(2, 'Poulet', 'Cornet au poulet grillé, légumes croquants, sauce au choix', 13.0, '/images/cornet photo.jpeg', 7);

-- CALZONE (category_id=3)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(3, 'Thon', 'Calzone farci au thon, mozzarella fondue, olives, tomates', 13.0, '/images/pizza-calzone.jpg', 1),
(3, 'Escalope Grillée', 'Calzone à l''escalope de poulet grillée, fromage fondant', 15.0, '/images/pizza-calzone.jpg', 2),
(3, 'Escalope Panée', 'Calzone croustillant, escalope panée, mozzarella filante', 15.0, '/images/pizza-calzone.jpg', 3),
(3, 'Chawarma', 'Calzone au poulet chawarma, sauce blanche, fromage', 15.0, '/images/pizza-calzone.jpg', 4),
(3, 'Cordon Bleu', 'Calzone au cordon bleu, crème fromagère, jambon fumé', 15.0, '/images/pizza-calzone.jpg', 5),
(3, 'Viande Hachée', 'Calzone à la viande hachée, poivrons grillés, mozzarella', 14.0, '/images/pizza-calzone.jpg', 6),
(3, 'Poulet', 'Calzone au poulet grillé, champignons, crème, fromage', 14.0, '/images/pizza-calzone.jpg', 7);

-- LIBANAIS (category_id=4)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(4, 'Thon', 'Pain libanais garni de thon, salade croquante, sauce citronnée', 12.0, '/images/splash_sandwich.jpg', 1),
(4, 'Escalope Grillée', 'Libanais à l''escalope grillée, crudités, sauce blanche', 14.0, '/images/splash_sandwich.jpg', 2),
(4, 'Escalope Panée', 'Libanais croustillant, escalope panée, légumes frais', 14.0, '/images/splash_sandwich.jpg', 3),
(4, 'Chawarma', 'Libanais chawarma authentique, sauce blanche, pickles', 14.0, '/images/splash_sandwich.jpg', 4),
(4, 'Cordon Bleu', 'Libanais au cordon bleu, salade, sauce fromagère maison', 14.0, '/images/splash_sandwich.jpg', 5),
(4, 'Viande Hachée', 'Libanais à la viande hachée, tomates, concombres, sauce', 13.0, '/images/splash_sandwich.jpg', 6),
(4, 'Poulet', 'Libanais au poulet grillé, salade, sauce maison', 13.0, '/images/splash_sandwich.jpg', 7);

-- CIABATTA (category_id=5)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(5, 'Thon', 'Ciabatta grillée au thon, roquette, tomates séchées, pesto', 12.0, '/images/cibatta photo.jpg', 1),
(5, 'Escalope Grillée', 'Ciabatta à l''escalope grillée, pesto basilic, légumes grillés', 14.0, '/images/cibatta photo.jpg', 2),
(5, 'Escalope Panée', 'Ciabatta croustillante, escalope panée, sauce tomate, salade', 14.0, '/images/cibatta photo.jpg', 3),
(5, 'Chawarma', 'Ciabatta chawarma, poulet mariné, crudités, sauce blanche', 14.0, '/images/cibatta photo.jpg', 4),
(5, 'Cordon Bleu', 'Ciabatta au cordon bleu, roquette, sauce fromagère', 14.0, '/images/cibatta photo.jpg', 5),
(5, 'Viande Hachée', 'Ciabatta à la viande hachée, oignons rouges, poivrons, cheddar', 13.0, '/images/cibatta photo.jpg', 6),
(5, 'Poulet', 'Ciabatta au poulet grillé, mozzarella, tomates confites', 13.0, '/images/cibatta photo.jpg', 7);

-- MAKLOUB (category_id=6)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(6, 'Thon', 'Makloub au thon, salade verte, olives, sauce maison', 10.0, '/images/makloub photo.jpg', 1),
(6, 'Escalope Grillée', 'Makloub à l''escalope de poulet grillée, légumes croquants', 12.0, '/images/makloub photo.jpg', 2),
(6, 'Escalope Panée', 'Makloub croustillant, escalope panée dorée, sauce au choix', 12.0, '/images/makloub photo.jpg', 3),
(6, 'Chawarma', 'Makloub au poulet chawarma, sauce blanche, salade', 12.0, '/images/makloub photo.jpg', 4),
(6, 'Cordon Bleu', 'Makloub au cordon bleu fondant, salade, sauce fromagère', 12.0, '/images/makloub photo.jpg', 5),
(6, 'Viande Hachée', 'Makloub à la viande hachée épicée, oignons caramélisés', 11.0, '/images/makloub photo.jpg', 6),
(6, 'Poulet', 'Makloub au poulet grillé, crudités, sauce maison', 11.0, '/images/makloub photo.jpg', 7);

-- PIZZA (category_id=7)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(7, 'Margherita', 'Sauce tomate fraîche, mozzarella di bufala, basilic frais', 14.0, '/images/splash_pizza.jpg', 1),
(7, 'Margherita Plus', 'Double mozzarella, sauce tomate, origan, basilic frais', 16.0, '/images/splash_pizza.jpg', 2),
(7, 'Pepperoni', 'Pepperoni épicé, mozzarella fondue, sauce tomate, origan', 18.0, '/images/splash_pizza.jpg', 3),
(7, '4 Fromages', 'Mozzarella, gorgonzola, parmesan affiné, emmental fondu', 20.0, '/images/splash_pizza.jpg', 4),
(7, 'Poulet', 'Poulet grillé, champignons, mozzarella, crème onctueuse', 17.0, '/images/splash_pizza.jpg', 5),
(7, 'Thon', 'Thon, oignons rouges, olives noires, mozzarella, sauce tomate', 17.0, '/images/splash_pizza.jpg', 6),
(7, 'Chawarma', 'Poulet chawarma, mozzarella, oignons, poivrons, sauce blanche', 17.0, '/images/splash_pizza.jpg', 7),
(7, 'Cordon Bleu', 'Cordon bleu, mozzarella, crème fromagère, jambon fumé', 18.0, '/images/splash_pizza.jpg', 8),
(7, 'Viande Hachée', 'Viande hachée épicée, poivrons grillés, mozzarella, sauce tomate', 18.0, '/images/splash_pizza.jpg', 9),
(7, 'Fruits de Mer', 'Crevettes, moules, calamars, sauce tomate safranée, mozzarella', 26.0, '/images/splash_pizza.jpg', 10),
(7, 'Végétarienne', 'Poivrons, courgettes, champignons, olives, mozzarella, sauce tomate', 16.0, '/images/splash_pizza.jpg', 11),
(7, 'Splash Pizza', 'Notre pizza signature : bœuf Angus, truffe noire, parmesan, œuf', 20.0, '/images/splash_pizza.jpg', 12),
(7, 'BBQ Chicken', 'Poulet mariné BBQ, oignons rouges, mozzarella, sauce fumée', 18.0, '/images/splash_pizza.jpg', 13),
(7, 'Calzone Pizza', 'Pizza calzone farcie à la ricotta, épinards, mozzarella filante', 20.0, '/images/splash_pizza.jpg', 14);

-- TRIANGLE (category_id=8)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(8, 'Thon', 'Triangle croustillant au thon, salade verte, sauce citronnée', 12.0, '/images/triangle photo.png', 1),
(8, 'Escalope Grillée', 'Triangle à l''escalope de poulet grillée, légumes frais', 15.0, '/images/triangle photo.png', 2),
(8, 'Escalope Panée', 'Triangle pané croustillant, escalope dorée, sauce maison', 15.0, '/images/triangle photo.png', 3),
(8, 'Chawarma', 'Triangle au poulet chawarma, sauce blanche, salade croquante', 15.0, '/images/triangle photo.png', 4),
(8, 'Cordon Bleu', 'Triangle au cordon bleu fondant, salade, sauce fromagère', 15.0, '/images/triangle photo.png', 5),
(8, 'Viande Hachée', 'Triangle à la viande hachée, oignons, poivrons, sauce', 14.0, '/images/triangle photo.png', 6),
(8, 'Poulet', 'Triangle au poulet grillé, crudités, sauce au choix', 14.0, '/images/triangle photo.png', 7);

-- BAGUETTE FARCIE (category_id=9)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(9, 'Thon', 'Baguette farcie au thon, salade croquante, tomates, sauce', 11.0, '/images/baguette farce.jpg', 1),
(9, 'Escalope Grillée', 'Baguette farcie à l''escalope de poulet grillée, crudités', 14.0, '/images/baguette farce.jpg', 2),
(9, 'Escalope Panée', 'Baguette farcie croustillante, escalope panée dorée', 14.0, '/images/baguette farce.jpg', 3),
(9, 'Chawarma', 'Baguette farcie au poulet chawarma, sauce blanche, salade', 13.0, '/images/baguette farce.jpg', 4),
(9, 'Cordon Bleu', 'Baguette farcie au cordon bleu, fromage fondant, salade', 14.0, '/images/baguette farce.jpg', 5),
(9, 'Viande Hachée', 'Baguette farcie à la viande hachée épicée, salade, oignons', 13.0, '/images/baguette farce.jpg', 6),
(9, 'Poulet', 'Baguette farcie au poulet grillé, légumes croquants, sauce', 13.0, '/images/baguette farce.jpg', 7);

-- TACOS (category_id=10)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(10, 'Thon', 'Tacos au thon mariné, frites croustillantes, fromage fondu, sauce', 12.0, '/images/tacos phoyo.jpg', 1),
(10, 'Escalope Grillée', 'Tacos à l''escalope de poulet grillée, frites, fromage fondu', 14.0, '/images/tacos phoyo.jpg', 2),
(10, 'Escalope Panée', 'Tacos croustillant, escalope panée, frites dorées, fromage', 14.0, '/images/tacos phoyo.jpg', 3),
(10, 'Chawarma', 'Tacos chawarma, poulet mariné, frites, fromage fondu', 14.0, '/images/tacos phoyo.jpg', 4),
(10, 'Cordon Bleu', 'Tacos au cordon bleu, frites croustillantes, fromage fondant', 14.0, '/images/tacos phoyo.jpg', 5),
(10, 'Viande Hachée', 'Tacos à la viande hachée, frites, fromage, sauce maison', 13.0, '/images/tacos phoyo.jpg', 6),
(10, 'Splash Tacos', 'Tacos signature : double viande, tous les fromages, sauce secrète', 18.0, '/images/tacos phoyo.jpg', 7);

-- PÂTES (category_id=11)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(11, 'Spaghetti Escalope', 'Spaghetti à l''escalope de poulet, sauce tomate', 15.0, '/images/pate.png', 1),
(11, 'Spaghetti Chawarma', 'Spaghetti au poulet chawarma, sauce blanche', 15.0, '/images/pate.png', 2),
(11, 'Spaghetti Bolognaise', 'Spaghetti, sauce tomate maison, bœuf haché', 20.0, '/images/pate.png', 3),
(11, 'Spaghetti 4 Fromages', 'Spaghetti aux 4 fromages, crème onctueuse', 17.0, '/images/pate.png', 4),
(11, 'Spaghetti Fruits de Mer', 'Spaghetti aux crevettes, moules, sauce safranée', 29.0, '/images/pate.png', 5),
(11, 'Penne au Thon', 'Penne au thon, sauce tomate, parmesan', 15.0, '/images/pate.png', 6),
(11, 'Spaghetti Escalope Champignons', 'Spaghetti à l''escalope, sauce champignons, crème', 17.0, '/images/pate.png', 7);

-- SALADES (category_id=12)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(12, 'Mechouia', 'Salade mechouia grillée, huile d''olive', 7.0, '/images/splash_salade.jpg', 1),
(12, 'Salade Tunisienne', 'Salade tunisienne, tomates, concombres, olives', 7.0, '/images/splash_salade.jpg', 2),
(12, 'Salade César', 'Poulet grillé, parmesan, croûtons dorés, sauce César maison', 15.0, '/images/splash_salade.jpg', 3);

-- LES PLATS (category_id=13)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(13, 'Grillade Mixte', 'Assortiment de viandes grillées, frites, salade', 30.0, '/images/poulet_croustillant.jpg', 1),
(13, 'Escalope Grillé', 'Escalope de poulet grillée, frites, salade', 16.0, '/images/poulet_croustillant.jpg', 2),
(13, 'Escalope Pané', 'Escalope de poulet panée, frites, salade', 17.0, '/images/poulet_croustillant.jpg', 3),
(13, 'Cordon Bleu', 'Cordon bleu fondant, frites, salade', 17.0, '/images/poulet_croustillant.jpg', 4),
(13, 'Mixte Poulet', 'Poulet grillé, merguez, frites, salade', 25.0, '/images/poulet_croustillant.jpg', 5),
(13, 'Dorade Grillée', 'Dorade grillée, légumes de saison, riz', 17.0, '/images/poulet_croustillant.jpg', 6),
(13, 'Loup Grillé', 'Loup grillé, légumes de saison, riz', 18.0, '/images/poulet_croustillant.jpg', 7),
(13, 'Oja Fruits de Mer', 'Oja aux fruits de mer, sauce maison', 25.0, '/images/poulet_croustillant.jpg', 8),
(13, 'Oja Merguez', 'Oja aux merguez, sauce maison', 14.0, '/images/poulet_croustillant.jpg', 9),
(13, 'Oja Escalope', 'Oja à l''escalope, sauce maison', 14.0, '/images/poulet_croustillant.jpg', 10),
(13, 'Escalope Sauce Champignons', 'Escalope de poulet, sauce champignons, riz', 18.0, '/images/poulet_croustillant.jpg', 11),
(13, 'Côte à l''Os', 'Côte à l''os grillée, frites, salade', 35.0, '/images/poulet_croustillant.jpg', 12),
(13, 'Splash', 'Notre plat signature, exclusif Splash Food', 35.0, '/images/poulet_croustillant.jpg', 13);

-- OMELETTE (category_id=14)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(14, 'Nature', 'Omelette aux œufs frais, cuite à la perfection, fines herbes', 8.0, '/images/splash_omelette.jpg', 1),
(14, 'Fromage', 'Omelette au fromage fondu, garnie d''herbes fraîches', 10.0, '/images/splash_omelette.jpg', 2),
(14, 'Thon', 'Omelette au thon, poivrons, oignons, fromage râpé', 12.0, '/images/splash_omelette.jpg', 3);

-- BOISSONS (category_id=15)
INSERT OR IGNORE INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(15, 'Soda', 'Coca-Cola, Sprite, Fanta, Schweppes 33cl', 1.5, '/images/splash_boissons.jpg', 1),
(15, 'Eau Minérale', 'Eau minérale naturelle 0.5L ou 1.5L', 1.0, '/images/splash_boissons.jpg', 2);
