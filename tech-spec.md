# Splash Food - Spécification Technique

## Dépendances

| Package | Version | Usage |
|---------|---------|-------|
| react | ^19.0 | Framework UI |
| react-dom | ^19.0 | Rendu DOM |
| react-router-dom | ^7.0 | Routing client-side |
| gsap | ^3.12 | Moteur d'animation (Timeline, ScrollTrigger) |
| lenis | ^1.1 | Smooth scrolling |
| swiper | ^11.0 | Carrousels (ventes, témoignages) |
| react-countup | ^6.5 | Compteurs animés (chiffres clés) |
| react-icons | ^5.0 | Icônes (Fa, Ri, Io) |
| tailwindcss | ^4.0 | Styling utilitaire |
| @tailwindcss/vite | ^4.0 | Plugin Tailwind pour Vite |

## Inventaire des Composants

### Layout (partagés)

| Composant | Source | Réutilisation |
|-----------|--------|---------------|
| Navbar | Custom | Toutes les pages - transparente au scroll top, fond #111111 au scroll |
| Footer | Custom | Toutes les pages |
| PageLoader | Custom | Une seule fois au chargement initial |
| PageTransition | Custom | Wrapper de route - animation GSAP enter/leave |
| SmoothScroll | Custom | Provider Lenis au niveau racine |

### Sections (par page)

**Accueil** : HeroVideo, SpecialtiesGrid, BestSellersCarousel, KeyFigures, TestimonialsCarousel, CTADelivery, InstagramFeed, FAQAccordion

**Menu** : PageHeader, CategoryFilters, ProductGrid

**A Propos** : PageHeader, StorySection, MissionSection, TeamGrid

**Galerie** : PageHeader, GalleryFilters, MasonryGrid, LightboxModal

**Reservation** : PageHeader, ReservationForm

**Livraison** : PageHeader, DeliveryServices, DeliveryZones

**Contact** : PageHeader, ContactInfoCards, ContactFormWithMap

### Composants Réutilisables

| Composant | Source | Utilisé par |
|-----------|--------|-------------|
| ProductCard | Custom | BestSellersCarousel, ProductGrid |
| SectionTitle | Custom | Toutes les sections de contenu |
| AnimatedElement | Custom (GSAP ScrollTrigger) | Toutes les sections - fadeUp, slideInLeft, slideInRight, scaleReveal |

### Hooks

| Hook | Usage |
|------|-------|
| useScrollAnimation | Création et nettoyage des ScrollTrigger GSAP |
| useLenis | Accès à l'instance Lenis pour la synchronisation ScrollTrigger |
| usePageTransition | Animation GSAP de transition entre routes |

## Plan d'Animation

| Animation | Bibliothèque | Approche | Complexité |
|-----------|-------------|----------|------------|
| Page loader (barre + fade out) | GSAP Timeline | Timeline séquentielle : fade logo -> tween width barre -> fade out loader | Medium |
| Page transitions (enter/leave) | GSAP | usePageTransition : timeline translateX + scale + opacity sur le wrapper de page | Medium |
| fadeUp (scroll) | GSAP ScrollTrigger | useScrollAnimation : opacity 0->1, y 40->0, trigger top 80%, stagger optionnel | Low |
| slideInLeft/Right (scroll) | GSAP ScrollTrigger | useScrollAnimation : x ±60->0, opacity 0->1 | Low |
| scaleReveal (scroll) | GSAP ScrollTrigger | useScrollAnimation : scale 0.9->1, opacity 0->1 | Low |
| parallaxImage (scroll) | GSAP ScrollTrigger | useScrollAnimation : y 50->-50, scrub true | Low |
| staggerCards (scroll) | GSAP ScrollTrigger | useScrollAnimation : stagger 80-150ms sur les enfants | Low |
| countUp (scroll) | react-countup + ScrollTrigger | Déclenchement via ScrollTrigger onEnter, duration 2000ms | Low |
| Menu mobile (slide) | GSAP Timeline | Overlay fade + menu x 100%->0 + liens stagger | Medium |
| Lightbox modal | GSAP | Overlay fade + image scale 0.9->1, fermeture inverse | Low |
| FAQ accordion | CSS transition | max-height + opacity + rotation chevron, pure CSS | Low |
| Hover cartes produit | CSS transition | transform scale + box-shadow, pure CSS | Low |
| Carrousels Swiper | Swiper | Configuration autoplay + pagination + navigation personnalisée | Low |
| Hero entrance | GSAP Timeline | Séquence fadeUp titre -> sous-titre -> boutons avec delays | Medium |
| Lenis smooth scroll | Lenis + GSAP | Instance globale, synchronisation via lenis.on('scroll', ScrollTrigger.update) | Low |

## État et Logique

### Gestion d'État

Aucun store global requis. État local (useState) suffisant pour :
- Menu mobile (ouvert/fermé)
- Catégorie active (Menu, Galerie)
- Lightbox (image active, index courant)
- FAQ (item ouvert)
- Page loader (état de chargement)

### Routing

7 routes statiques via React Router v7 avec data API :
- `/` - Accueil
- `/menu` - Menu
- `/a-propos` - A Propos
- `/galerie` - Galerie
- `/reservation` - Reservation
- `/livraison` - Livraison
- `/contact` - Contact

### Intégrations Externes

- **Google Maps** : iframe embed sur page Contact (pas de lib JS nécessaire)
- **Liens externes** : Glovo, Jumia Food, WhatsApp, Instagram (liens directs, pas d'API)

## Autres Décisions Clés

### Architecture Multi-Pages

Routing React Router v7 avec structure de layout partagé (Navbar + Footer) et page content avec transitions animées. Chaque page est chargée via lazy imports pour le code splitting.

### Organisation des Assets

Images générées stockées dans `public/images/` (chemin statique), logos livraison (Glovo, Jumia) stockés en PNG transparent dans `public/logos/`. La vidéo hero dans `public/videos/`.

### Responsive Strategy

Mobile-first via Tailwind breakpoints. Grille 12 colonnes adaptative. Padding section : 30px mobile / 60px desktop. Titre hero : 36px mobile / 60px desktop.
