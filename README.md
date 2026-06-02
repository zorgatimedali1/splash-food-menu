# 🍔 Splash Food Menu

> Modern responsive food menu and delivery application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 📋 Overview

Splash Food Menu is a modern single-page application that showcases a restaurant-style menu, product details, and a shopping cart experience.

The project demonstrates:

* Component-based React architecture
* Client-side routing with React Router
* Global cart management using React Context
* Responsive UI with Tailwind CSS
* Fast development workflow powered by Vite

---

## 🚀 Features

* Responsive restaurant landing page
* Interactive food menu
* Product detail pages
* Shopping cart sidebar
* Add / remove items from cart
* React Context state management
* Client-side routing
* Modern UI with Tailwind CSS
* Mobile-friendly design

---

## ⚙️ How It Works

### Browse the Menu

Users can explore available food items on the **Menu** page.

### View Product Details

Selecting a product navigates to the **Product Detail** page where users can view:

* Product image
* Description
* Price
* Additional details

### Cart Management

Users can:

* Add products to the cart
* Increase or decrease quantities
* Remove products
* View cart totals

Cart state is managed globally through:

```text
src/context/CartContext.tsx
```

### Checkout

A placeholder checkout flow is included and can be connected to a real backend or payment gateway.

---

## 🛠️ Technologies Used

| Technology   | Purpose             |
| ------------ | ------------------- |
| React        | Frontend Framework  |
| TypeScript   | Type Safety         |
| Vite         | Build Tool          |
| Tailwind CSS | Styling             |
| PostCSS      | CSS Processing      |
| React Router | Client-side Routing |

---

## 📁 Project Structure

```text
Splash-Food-Menu/
│
├── public/
│   ├── images/
│   └── videos/
│
├── src/
│   ├── components/
│   │   ├── Navbar
│   │   ├── Footer
│   │   ├── Cart
│   │   └── UI Components
│   │
│   ├── context/
│   │   └── CartContext.tsx
│   │
│   ├── data/
│   │   └── index.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Menu.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Contact.tsx
│   │   └── Delivery.tsx
│   │
│   ├── sections/
│   │   └── Page Sections
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📍 Important Files

| File                          | Description                 |
| ----------------------------- | --------------------------- |
| `index.html`                  | Application entry HTML      |
| `src/main.tsx`                | React entry point           |
| `src/App.tsx`                 | Main application and routes |
| `src/context/CartContext.tsx` | Global cart state           |
| `src/data/index.ts`           | Menu data                   |
| `public/`                     | Images and videos           |

---

## ▶️ Run Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Splash-Food-Menu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 📦 Production Build

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🌐 Deployment

The application can be deployed on:

* Vercel
* Netlify
* GitHub Pages
* Firebase Hosting

Build the project first:

```bash
npm run build
```

Then deploy the generated output from:

```text
dist/
```

---

## 🔮 Future Improvements

* User authentication
* Online ordering system
* Payment integration (Stripe / PayPal)
* Order history
* Multi-language support
* Backend API integration
* Admin dashboard
* Headless CMS integration

---

## 📝 Notes

This repository contains the **frontend only**.

To support:

* Real orders
* Payments
* User accounts
* Order tracking

you will need to connect it to a backend service or API.

---

## 📄 License

This project is available under the **MIT License**.

Feel free to use, modify, and distribute it for personal or commercial projects.
