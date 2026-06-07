export const NAV_LINKS = [
  { label: 'ACCUEIL', path: '/' },
  { label: 'MENU', path: '/menu' },
  { label: 'A PROPOS', path: '/a-propos' },
  { label: 'LIVRAISON', path: '/livraison' },
  { label: 'CONTACT', path: '/contact' },
];

export const BEST_SELLERS = [
  { name: 'Splash Pizza', description: 'Notre pizza signature : bœuf, truffe, parmesan', price: 20, image: '/images/splash_pizza.jpg', slug: 'pizza-splash-pizza', tagline: 'La star du menu ! Un pur délice à chaque bouchée' },
  { name: 'Splash Tacos', description: 'Tacos signature double viande, tous les fromages', price: 18, image: '/images/tacos phoyo.jpg', slug: 'tacos-splash-tacos', tagline: 'Le roi des tacos, généreux et savoureux' },
  { name: 'Chawarma Tabouna', description: 'Tabouna garnie de poulet chawarma mariné', price: 12, image: '/images/tabouna photo.jpg', slug: 'tabouna-chawarma', tagline: 'Chuuut... la pépite cachée du chef' },
  { name: 'Cordon Bleu Calzone', description: 'Calzone au cordon bleu fondant, crème fromagère', price: 15, image: '/images/pizza-calzone.jpg', slug: 'calzone-cordon-bleu', tagline: 'Fondant, généreux, tout simplement irrésistible' },
  { name: 'Pâtes Carbonara', description: 'Spaghetti carbonara, pancetta, parmesan', price: 23, image: '/images/pate.png', slug: 'pates-spaghetti-carbonara', tagline: 'L\'authentique carbonara, crémeuse et parfumée' },
  { name: 'Poulet Croustillant', description: 'Poulet croustillant pané, frites, sauce BBQ', price: 18, image: '/images/poulet_croustillant.jpg', slug: 'les-plats-poulet-croustillant', tagline: 'Croustillant à l\'extérieur, tendre à l\'intérieur' },
];

export function getKeyFigures() {
  return [
    { number: 15000, suffix: '+', label: 'Clients satisfaits' },
    { number: MENU_PRODUCTS.length, suffix: '+', label: 'Produits au menu' },
    { number: 8, suffix: '', label: 'Années d\'expérience' },
    { number: 1, suffix: '', label: 'Restaurants' },
  ];
}

export const TESTIMONIALS = [
  { text: 'La meilleure pizza de la ville ! La pâte est incroyablement croustillante et les garnitures toujours fraîches.', name: 'Ahmed B.', rating: 5 },
  { text: 'Un vrai régal à chaque visite. Le Chawarma Tabouna est incroyable !', name: 'Sarah M.', rating: 5 },
  { text: 'Les pâtes Carbonara sont divines. La sauce est crémeuse et les saveurs parfaitement équilibrées.', name: 'Karim L.', rating: 5 },
  { text: 'Enfin un restaurant street food premium. Qualité au rendez-vous, menu varié et délicieux.', name: 'Youssef A.', rating: 5 },
  { text: 'Leurs tabounas et leurs makloubs sont les meilleurs de la ville. Extra frais !', name: 'Laila K.', rating: 5 },
  { text: 'Super rapport qualité-prix. Les tacos sont bien garnis et les desserts sont un pur moment de gourmandise.', name: 'Omar F.', rating: 5 },
];

export const FAQ_ITEMS = [
  { question: 'Quels sont vos horaires d\'ouverture ?', answer: 'Nous sommes ouverts tous les jours de 11h à 23h. Le week-end, nous fermons à minuit.' },
  { question: 'Proposez-vous la livraison ?', answer: 'Oui, nous livrons à domicile pour seulement 2 DT. Commandez par téléphone ou via nos partenaires.' },
  { question: 'Puis-je passer commande par téléphone ?', answer: 'Absolument ! Appelez-nous pour passer votre commande directement.' },
  { question: 'Avez-vous des options végétariennes ?', answer: 'Oui, nous proposons des pizzas, salades, pâtes et sandwichs végétariens.' },
  { question: 'Acceptez-vous les commandes groupées ?', answer: 'Oui, nous avons des offres spéciales pour les commandes groupées. Contactez-nous.' },
  { question: 'Comment puis-je faire une réservation ?', answer: 'Vous pouvez réserver via notre page de réservation ou en nous appelant directement.' },
];

export const CATEGORIES = [
  { name: 'TOUT', count: 106 },
  { name: 'TABOUNA', count: 8 },
  { name: 'CORNET', count: 7 },
  { name: 'CALZONE', count: 7 },
  { name: 'LIBANAIS', count: 7 },
  { name: 'CIABATTA', count: 7 },
  { name: 'MAKLOUB', count: 7 },
  { name: 'PIZZA', count: 14 },
  { name: 'TRIANGLE', count: 7 },
  { name: 'BAGUETTE FARCIE', count: 7 },
  { name: 'TACOS', count: 7 },
  { name: 'PÂTES', count: 7 },
  { name: 'SALADES', count: 3 },
  { name: 'LES PLATS', count: 13 },
  { name: 'OMELETTE', count: 3 },
  { name: 'BOISSONS', count: 2 },
];

export const MENU_PRODUCTS = [
  // — TABOUNA —
  { name: 'Thon', description: 'Tabouna garnie de thon émietté, olives vertes et tomates fraîches', price: 10, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Escalope Grillée', description: 'Escalope de poulet grillée aux herbes, salade croquante, sauce maison', price: 12, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Escalope Panée', description: 'Escalope de poulet panée croustillante, légumes frais, sauce au choix', price: 12, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Chawarma', description: 'Poulet chawarma mariné, sauce blanche onctueuse, salade croquante', price: 12, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Cordon Bleu', description: 'Cordon bleu fondant au fromage et jambon, sauce fromagère', price: 12, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Viande Hachée', description: 'Viande hachée grillée aux épices, oignons caramélisés, salade', price: 11, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Poulet', description: 'Poulet grillé tendre, salade fraîche, sauce au choix', price: 11, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },
  { name: 'Merguez', description: 'Merguez grillées, poivrons sautés, sauce harissa maison', price: 9, category: 'TABOUNA', image: '/images/tabouna photo.jpg' },

  // — CORNET —
  { name: 'Thon', description: 'Cornet croustillant au thon, olives vertes, salade, sauce citronnée', price: 12, category: 'CORNET', image: '/images/cornet photo.jpeg' },
  { name: 'Escalope Grillée', description: 'Cornet garni d\'escalope de poulet grillée, crudités croquantes', price: 14, category: 'CORNET', image: '/images/cornet photo.jpeg' },
  { name: 'Escalope Panée', description: 'Cornet croustillant, escalope panée dorée, sauce maison', price: 14, category: 'CORNET', image: '/images/cornet photo.jpeg' },
  { name: 'Chawarma', description: 'Cornet chawarma, poulet mariné, sauce blanche, salade', price: 14, category: 'CORNET', image: '/images/cornet photo.jpeg' },
  { name: 'Cordon Bleu', description: 'Cornet au cordon bleu, fromage fondant, salade verte', price: 14, category: 'CORNET', image: '/images/cornet photo.jpeg' },
  { name: 'Viande Hachée', description: 'Cornet à la viande hachée épicée, oignons, tomates', price: 13, category: 'CORNET', image: '/images/cornet photo.jpeg' },
  { name: 'Poulet', description: 'Cornet au poulet grillé, légumes croquants, sauce au choix', price: 13, category: 'CORNET', image: '/images/cornet photo.jpeg' },

  // — CALZONE —
  { name: 'Thon', description: 'Calzone farci au thon, mozzarella fondue, olives, tomates', price: 13, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },
  { name: 'Escalope Grillée', description: 'Calzone à l\'escalope de poulet grillée, fromage fondant', price: 15, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },
  { name: 'Escalope Panée', description: 'Calzone croustillant, escalope panée, mozzarella filante', price: 15, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },
  { name: 'Chawarma', description: 'Calzone au poulet chawarma, sauce blanche, fromage', price: 15, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },
  { name: 'Cordon Bleu', description: 'Calzone au cordon bleu, crème fromagère, jambon fumé', price: 15, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },
  { name: 'Viande Hachée', description: 'Calzone à la viande hachée, poivrons grillés, mozzarella', price: 14, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },
  { name: 'Poulet', description: 'Calzone au poulet grillé, champignons, crème, fromage', price: 14, category: 'CALZONE', image: '/images/pizza-calzone.jpg' },

  // — LIBANAIS —
  { name: 'Thon', description: 'Pain libanais garni de thon, salade croquante, sauce citronnée', price: 12, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },
  { name: 'Escalope Grillée', description: 'Libanais à l\'escalope grillée, crudités, sauce blanche', price: 14, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },
  { name: 'Escalope Panée', description: 'Libanais croustillant, escalope panée, légumes frais', price: 14, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },
  { name: 'Chawarma', description: 'Libanais chawarma authentique, sauce blanche, pickles', price: 14, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },
  { name: 'Cordon Bleu', description: 'Libanais au cordon bleu, salade, sauce fromagère maison', price: 14, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },
  { name: 'Viande Hachée', description: 'Libanais à la viande hachée, tomates, concombres, sauce', price: 13, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },
  { name: 'Poulet', description: 'Libanais au poulet grillé, salade, sauce maison', price: 13, category: 'LIBANAIS', image: '/images/splash_sandwich.jpg' },

  // — CIABATTA —

  { name: 'Thon', description: 'Ciabatta grillée au thon, roquette, tomates séchées, pesto', price: 12, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  { name: 'Escalope Grillée', description: 'Ciabatta à l\'escalope grillée, pesto basilic, légumes grillés', price: 14, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  { name: 'Escalope Panée', description: 'Ciabatta croustillante, escalope panée, sauce tomate, salade', price: 14, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  { name: 'Chawarma', description: 'Ciabatta chawarma, poulet mariné, crudités, sauce blanche', price: 14, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  { name: 'Cordon Bleu', description: 'Ciabatta au cordon bleu, roquette, sauce fromagère', price: 14, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  { name: 'Viande Hachée', description: 'Ciabatta à la viande hachée, oignons rouges, poivrons, cheddar', price: 13, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  { name: 'Poulet', description: 'Ciabatta au poulet grillé, mozzarella, tomates confites', price: 13, category: 'CIABATTA', image: '/images/cibatta photo.jpg' },

  // — MAKLOUB —
  { name: 'Thon', description: 'Makloub au thon, salade verte, olives, sauce maison', price: 10, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },
  { name: 'Escalope Grillée', description: 'Makloub à l\'escalope de poulet grillée, légumes croquants', price: 12, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },
  { name: 'Escalope Panée', description: 'Makloub croustillant, escalope panée dorée, sauce au choix', price: 12, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },
  { name: 'Chawarma', description: 'Makloub au poulet chawarma, sauce blanche, salade', price: 12, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },
  { name: 'Cordon Bleu', description: 'Makloub au cordon bleu fondant, salade, sauce fromagère', price: 12, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },
  { name: 'Viande Hachée', description: 'Makloub à la viande hachée épicée, oignons caramélisés', price: 11, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },
  { name: 'Poulet', description: 'Makloub au poulet grillé, crudités, sauce maison', price: 11, category: 'MAKLOUB', image: '/images/makloub photo.jpg' },

  // — PIZZA —
  { name: 'Margherita', description: 'Sauce tomate fraîche, mozzarella di bufala, basilic frais', price: 14, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Margherita Plus', description: 'Double mozzarella, sauce tomate, origan, basilic frais', price: 16, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Pepperoni', description: 'Pepperoni épicé, mozzarella fondue, sauce tomate, origan', price: 18, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: '4 Fromages', description: 'Mozzarella, gorgonzola, parmesan affiné, emmental fondu', price: 20, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Poulet', description: 'Poulet grillé, champignons, mozzarella, crème onctueuse', price: 17, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Thon', description: 'Thon, oignons rouges, olives noires, mozzarella, sauce tomate', price: 17, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Chawarma', description: 'Poulet chawarma, mozzarella, oignons, poivrons, sauce blanche', price: 17, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Cordon Bleu', description: 'Cordon bleu, mozzarella, crème fromagère, jambon fumé', price: 18, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Viande Hachée', description: 'Viande hachée épicée, poivrons grillés, mozzarella, sauce tomate', price: 18, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Fruits de Mer', description: 'Crevettes, moules, calamars, sauce tomate safranée, mozzarella', price: 26, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Végétarienne', description: 'Poivrons, courgettes, champignons, olives, mozzarella, sauce tomate', price: 16, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Splash Pizza', description: 'Notre pizza signature : bœuf Angus, truffe noire, parmesan, œuf', price: 20, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'BBQ Chicken', description: 'Poulet mariné BBQ, oignons rouges, mozzarella, sauce fumée', price: 18, category: 'PIZZA', image: '/images/splash_pizza.jpg' },
  { name: 'Calzone Pizza', description: 'Pizza calzone farcie à la ricotta, épinards, mozzarella filante', price: 20, category: 'PIZZA', image: '/images/splash_pizza.jpg' },

  // — TRIANGLE —
  { name: 'Thon', description: 'Triangle croustillant au thon, salade verte, sauce citronnée', price: 12, category: 'TRIANGLE', image: '/images/triangle photo.png' },
  { name: 'Escalope Grillée', description: 'Triangle à l\'escalope de poulet grillée, légumes frais', price: 15, category: 'TRIANGLE', image: '/images/triangle photo.png' },
  { name: 'Escalope Panée', description: 'Triangle pané croustillant, escalope dorée, sauce maison', price: 15, category: 'TRIANGLE', image: '/images/triangle photo.png' },
  { name: 'Chawarma', description: 'Triangle au poulet chawarma, sauce blanche, salade croquante', price: 15, category: 'TRIANGLE', image: '/images/triangle photo.png' },
  { name: 'Cordon Bleu', description: 'Triangle au cordon bleu fondant, salade, sauce fromagère', price: 15, category: 'TRIANGLE', image: '/images/triangle photo.png' },
  { name: 'Viande Hachée', description: 'Triangle à la viande hachée, oignons, poivrons, sauce', price: 14, category: 'TRIANGLE', image: '/images/triangle photo.png' },
  { name: 'Poulet', description: 'Triangle au poulet grillé, crudités, sauce au choix', price: 14, category: 'TRIANGLE', image: '/images/triangle photo.png' },

  // — BAGUETTE FARCIE —
  { name: 'Thon', description: 'Baguette farcie au thon, salade croquante, tomates, sauce', price: 11, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },
  { name: 'Escalope Grillée', description: 'Baguette farcie à l\'escalope de poulet grillée, crudités', price: 14, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },
  { name: 'Escalope Panée', description: 'Baguette farcie croustillante, escalope panée dorée', price: 14, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },
  { name: 'Chawarma', description: 'Baguette farcie au poulet chawarma, sauce blanche, salade', price: 13, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },
  { name: 'Cordon Bleu', description: 'Baguette farcie au cordon bleu, fromage fondant, salade', price: 14, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },
  { name: 'Viande Hachée', description: 'Baguette farcie à la viande hachée épicée, salade, oignons', price: 13, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },
  { name: 'Poulet', description: 'Baguette farcie au poulet grillé, légumes croquants, sauce', price: 13, category: 'BAGUETTE FARCIE', image: '/images/baguette farce.jpg' },

  // — TACOS —
  { name: 'Thon', description: 'Tacos au thon mariné, frites croustillantes, fromage fondu, sauce', price: 12, category: 'TACOS', image: '/images/tacos phoyo.jpg' },
  { name: 'Escalope Grillée', description: 'Tacos à l\'escalope de poulet grillée, frites, fromage fondu', price: 14, category: 'TACOS', image: '/images/tacos phoyo.jpg' },
  { name: 'Escalope Panée', description: 'Tacos croustillant, escalope panée, frites dorées, fromage', price: 14, category: 'TACOS', image: '/images/tacos phoyo.jpg' },
  { name: 'Chawarma', description: 'Tacos chawarma, poulet mariné, frites, fromage fondu', price: 14, category: 'TACOS', image: '/images/tacos phoyo.jpg' },
  { name: 'Cordon Bleu', description: 'Tacos au cordon bleu, frites croustillantes, fromage fondant', price: 14, category: 'TACOS', image: '/images/tacos phoyo.jpg' },
  { name: 'Viande Hachée', description: 'Tacos à la viande hachée, frites, fromage, sauce maison', price: 13, category: 'TACOS', image: '/images/tacos phoyo.jpg' },
  { name: 'Splash Tacos', description: 'Tacos signature : double viande, tous les fromages, sauce secrète', price: 18, category: 'TACOS', image: '/images/tacos phoyo.jpg' },

  // — PÂTES —
  { name: 'Spaghetti Escalope', description: 'Spaghetti à l\'escalope de poulet, sauce tomate', price: 15, category: 'PÂTES', image: '/images/pate.png' },
  { name: 'Spaghetti Chawarma', description: 'Spaghetti au poulet chawarma, sauce blanche', price: 15, category: 'PÂTES', image: '/images/pate.png' },
  { name: 'Spaghetti Bolognaise', description: 'Spaghetti, sauce tomate maison, bœuf haché', price: 20, category: 'PÂTES', image: '/images/pate.png' },
  { name: 'Spaghetti 4 Fromages', description: 'Spaghetti aux 4 fromages, crème onctueuse', price: 17, category: 'PÂTES', image: '/images/pate.png' },
  { name: 'Spaghetti Fruits de Mer', description: 'Spaghetti aux crevettes, moules, sauce safranée', price: 29, category: 'PÂTES', image: '/images/pate.png' },
  { name: 'Penne au Thon', description: 'Penne au thon, sauce tomate, parmesan', price: 15, category: 'PÂTES', image: '/images/pate.png' },
  { name: 'Spaghetti Escalope Champignons', description: 'Spaghetti à l\'escalope, sauce champignons, crème', price: 17, category: 'PÂTES', image: '/images/pate.png' },

  // — SALADES —
  { name: 'Mechouia', description: 'Salade mechouia grillée, huile d\'olive', price: 7, category: 'SALADES', image: '/images/splash_salade.jpg' },
  { name: 'Salade Tunisienne', description: 'Salade tunisienne, tomates, concombres, olives', price: 7, category: 'SALADES', image: '/images/splash_salade.jpg' },
  { name: 'Salade César', description: 'Poulet grillé, parmesan, croûtons dorés, sauce César maison', price: 15, category: 'SALADES', image: '/images/splash_salade.jpg' },

  // — LES PLATS —
  { name: 'Grillade Mixte', description: 'Assortiment de viandes grillées, frites, salade', price: 30, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Escalope Grillé', description: 'Escalope de poulet grillée, frites, salade', price: 16, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Escalope Pané', description: 'Escalope de poulet panée, frites, salade', price: 17, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Cordon Bleu', description: 'Cordon bleu fondant, frites, salade', price: 17, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Mixte Poulet', description: 'Poulet grillé, merguez, frites, salade', price: 25, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Dorade Grillée', description: 'Dorade grillée, légumes de saison, riz', price: 17, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Loup Grillé', description: 'Loup grillé, légumes de saison, riz', price: 18, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Oja Fruits de Mer', description: 'Oja aux fruits de mer, sauce maison', price: 25, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Oja Merguez', description: 'Oja aux merguez, sauce maison', price: 14, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Oja Escalope', description: 'Oja à l\'escalope, sauce maison', price: 14, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Escalope Sauce Champignons', description: 'Escalope de poulet, sauce champignons, riz', price: 18, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Côte à l\'Os', description: 'Côte à l\'os grillée, frites, salade', price: 35, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },
  { name: 'Splash', description: 'Notre plat signature, exclusif Splash Food', price: 35, category: 'LES PLATS', image: '/images/poulet_croustillant.jpg' },

  // — OMELETTE —
  { name: 'Nature', description: 'Omelette aux œufs frais, cuite à la perfection, fines herbes', price: 8, category: 'OMELETTE', image: '/images/splash_omelette.jpg' },
  { name: 'Fromage', description: 'Omelette au fromage fondu, garnie d\'herbes fraîches', price: 10, category: 'OMELETTE', image: '/images/splash_omelette.jpg' },
  { name: 'Thon', description: 'Omelette au thon, poivrons, oignons, fromage râpé', price: 12, category: 'OMELETTE', image: '/images/splash_omelette.jpg' },

  // — BOISSONS —
  { name: 'Soda', description: 'Coca-Cola, Sprite, Fanta, Schweppes 33cl', price: 1.5, category: 'BOISSONS', image: '/images/splash_boissons.jpg' },
  { name: 'Eau Minérale', description: 'Eau minérale naturelle 0.5L ou 1.5L', price: 1, category: 'BOISSONS', image: '/images/splash_boissons.jpg' },

];

export const TEAM_MEMBERS = [
  { name: 'Youssef Alami', role: 'Fondateur & CEO', image: '/images/team_youssef.jpg' },
  { name: 'Karim Benali', role: 'Chef Exécutif', image: '/images/team_karim.jpg' },
  { name: 'Sarah Mansouri', role: 'Directrice des Opérations', image: '/images/team_sarah.jpg' },
  { name: 'Omar Fassi', role: 'Responsable Marketing', image: '/images/team_omar.jpg' },
];

export const DELIVERY_SERVICES = [
  { name: 'WhatsApp', description: 'Commandez directement', logo: '/logos/whatsapp_logo.png', link: 'https://wa.me/21699744593' },
];

export const DELIVERY_ZONES = [
  { name: 'Kalaa Kebira', time: '10-15 min' },
  { name: 'Kalaa Sghira', time: '10-15 min' },
  { name: 'Akouda', time: '15-20 min' },
  { name: 'Hammam Sousse', time: '20-25 min' },
  { name: 'Sousse Centre', time: '20-30 min' },
  { name: 'Sousse Nord', time: '25-35 min' },
];

export const CONTACT_INFO = [
  { icon: 'phone', title: 'Téléphone', value: '+216 99 744 593' },
  { icon: 'mapPin', title: 'Adresse', value: 'Avenue 14 Janvier, Kalaa Kebira 4060' },
  { icon: 'clock', title: 'Horaires', value: 'Lun-Dim : 11h - 23h' },
  { icon: 'mail', title: 'Email', value: 'contact@splashfood.tn' },
];

export function getProductSlug(product: typeof MENU_PRODUCTS[0]): string {
  return `${product.category}-${product.name}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getProductBySlug(slug: string): typeof MENU_PRODUCTS[0] | undefined {
  return MENU_PRODUCTS.find((p) => getProductSlug(p) === slug);
}

export const SUPPLÉMENTS_PRODUCTS = [
  { name: 'Frites', price: 2.5 },
  { name: 'Fromage', price: 1.5 },
  { name: 'Sauce', price: 1 },
  { name: 'Salade', price: 1.5 },
  { name: 'Pain', price: 0.5 },
  { name: 'Œuf', price: 1.5 },
  { name: 'Mayonnaise', price: 0.5 },
  { name: 'Ketchup', price: 0.5 },
  { name: 'Harissa', price: 0.5 },
  { name: 'Champignons', price: 2.5 },
  { name: 'Bacon', price: 3 },
  { name: 'Poulet', price: 4 },
  { name: 'Bœuf', price: 5 },
  { name: 'Cordon Bleu', price: 6 },
];

export const DELIVERY_FEE = 2;

export const WHATSAPP_NUMBER = '21699744593';
