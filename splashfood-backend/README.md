# Splash Food — Backend API + Admin Dashboard

## Stack
- **Backend**: Cloudflare Workers (TypeScript) + Hono-style routing
- **Database**: Cloudflare D1 (SQLite) — ID: `85326999-ba92-4e4a-ac53-5543f778aaf9`
- **Storage**: Cloudflare R2 (images)
- **Dashboard**: React 19 + Vite + TanStack Query + Tailwind CSS

---

## Database (Already Live ✅)

Database `splashfood-db` is already created and seeded on Cloudflare D1 with:
- Admin user: `admin@splashfood.tn` / `splashfood2026`
- 15 categories (TABOUNA → BOISSONS)
- 8 supplements (Fromage, Olives, etc.)
- Site settings (WhatsApp, delivery fee, address, hours)

---

## Setup

### 1. Install Wrangler globally
```bash
npm install -g wrangler
wrangler login
```

### 2. Create R2 bucket for images
```bash
npx wrangler r2 bucket create splashfood-images
```

Then enable **public access** on the bucket in the Cloudflare dashboard:
→ R2 → splashfood-images → Settings → Public Access → Enable

Copy the public URL (e.g. `https://pub-xxxxx.r2.dev`) and update `wrangler.toml`:
```toml
[vars]
R2_PUBLIC_URL = "https://pub-xxxxx.r2.dev"   # ← update this
FRONTEND_ORIGIN = "https://splashfood.tn"     # ← update this
```

### 3. Deploy the Worker
```bash
cd splashfood-backend
npm install
npx wrangler deploy
```

Your API will be live at: `https://splashfood-backend.<your-account>.workers.dev`

---

## Dashboard

### Development
```bash
cd dashboard
npm install
# Edit .env if needed:
echo "VITE_API_URL=https://splashfood-backend.<your-account>.workers.dev" > .env
npm run dev
# → http://localhost:5174
```

### Build & Deploy
```bash
npm run build
# Deploy dist/ to Cloudflare Pages, Netlify, Vercel, etc.
```

---

## API Reference

### Public Endpoints (no auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | All active categories |
| GET | `/api/products` | Products (supports `?category=&search=&page=&limit=`) |
| GET | `/api/supplements` | All active supplements |
| GET | `/api/settings` | Site settings |
| POST | `/api/orders` | Submit an order |
| POST | `/api/contact` | Submit a contact message |
| POST | `/api/auth/login` | Get JWT token |

### Admin Endpoints (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Current user |
| POST/PUT/DELETE | `/api/categories/*` | Category management |
| POST/PUT/DELETE | `/api/products/*` | Product management |
| PUT | `/api/products/:id/toggle` | Toggle product active |
| POST/PUT/DELETE | `/api/supplements/*` | Supplement management |
| GET | `/api/orders` | All orders (filters: `?status=&from=&to=`) |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/contact` | All messages |
| PUT | `/api/contact/:id/read` | Mark as read |
| GET | `/api/stats/overview` | Dashboard stats |
| GET | `/api/stats/revenue` | Revenue chart data |
| GET | `/api/stats/top-products` | Top 10 products |
| GET | `/api/stats/recent-orders` | Last 20 orders |
| PUT | `/api/settings` | Update site settings |

---

## Project Structure

```
splashfood-backend/
├── src/
│   ├── index.ts              # Worker entry, CORS, router
│   ├── routes/               # auth, categories, products, supplements, orders, contact, stats, settings
│   ├── middleware/           # auth (JWT + cache), rateLimit, security headers
│   ├── utils/                # cache, pagination, jwt, imageUpload
│   ├── db/
│   │   ├── schema.sql        # D1 table definitions
│   │   └── seed.sql          # Initial data
│   └── types/index.ts        # TypeScript interfaces
├── dashboard/
│   ├── src/
│   │   ├── main.tsx          # Entry + QueryClient
│   │   ├── App.tsx           # Router + lazy routes + auth guard
│   │   ├── pages/            # Login, Overview, Products, Categories, Supplements, Orders, Messages, Settings
│   │   ├── components/       # Sidebar, TopBar, Modal, ImageUpload, StatsCard, StatusBadge, Pagination
│   │   ├── hooks/useApi.ts   # All TanStack Query hooks
│   │   └── lib/              # api.ts, auth.ts, localStorage.ts
│   ├── vite.config.ts        # With manualChunks code splitting
│   └── tailwind.config.js    # Matching frontend design tokens
├── wrangler.toml             # Cloudflare config (D1 + R2 bindings)
└── README.md
```

---

## Performance Features Implemented
- ✅ In-memory cache (Map) with TTL per resource type
- ✅ Cache-Control headers (public/private/immutable)
- ✅ TanStack Query v5 with staleTime + optimistic updates
- ✅ React.lazy() + Suspense for all dashboard pages
- ✅ Vite manualChunks code splitting (vendor-react, vendor-charts, etc.)
- ✅ Server-side filtering and pagination (SQL LIMIT/OFFSET)
- ✅ JWT session cache (5 min in-memory, avoids repeated DB lookups)
- ✅ Promise.all for parallel async operations
- ✅ Per-endpoint rate limiting
- ✅ Security headers on all responses
- ✅ Cache invalidation on every write (flushMultiple)
- ✅ localStorage persistence (sidebar state, filters)
- ✅ loading="lazy" on all table/grid images
