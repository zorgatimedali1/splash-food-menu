Splash Food Menu
A modern responsive food menu and delivery front-end built with React, TypeScript, Vite and Tailwind CSS.

Overview
Splash Food Menu is a single-page application that showcases a restaurant-style menu, product details, and a shopping cart. It demonstrates a component-driven UI, client-side routing, and a simple cart context for adding/removing items.

How it works
Built with React + TypeScript and bootstrapped with Vite for fast dev builds.
Routing is handled by React Router (see src/pages/*).
UI components live in src/components and layout sections in src/sections.
src/context/CartContext.tsx provides cart state and actions via React Context.
Menu items and demo data are in src/data/index.ts.
Static assets (images & videos) are in the public folder and referenced from the app.
User flow:

Browse the menu on the Menu page.
Click an item to view details on the ProductDetail page.
Add items to the cart using the floating cart button or product controls.
View and modify the cart in the sidebar; proceed to checkout (placeholder flow).
Technologies
TypeScript
React
Vite
Tailwind CSS
PostCSS
React Router
Project structure (important files)
index.html — app entry HTML
src/main.tsx — React entry
src/App.tsx — top-level app and routes
src/components — UI components (Navbar, Footer, Cart, etc.)
src/context/CartContext.tsx — cart state management
src/pages — route pages (Home, Menu, ProductDetail, Contact, Delivery)
public/ — static images and videos
Run locally
Install dependencies
cd app
npm install
Start dev server
npm run dev
Build for production
npm run build
npm run preview
Deployment
This project can be hosted on platforms like Vercel, Netlify, or GitHub Pages. Deploy the app/dist build output after running npm run build.

Notes
This repo contains the frontend only. Integrate with a backend/API to support real orders and payments.
Feel free to update the UI, add translations, or connect to a headless CMS.
License
Choose a license for your repo (e.g., MIT) or add one later.
