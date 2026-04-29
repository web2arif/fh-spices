# FH Spices

E-commerce and operator dashboard for **FH Spices** — a homemade Hyderabadi pickle, spice, and protein-snack brand based in Hyderabad, India.

Built by [Arif Mohammad](https://arifmohammad.netlify.app).

## What this is

A two-part application:

1. **Public site** — product catalog, brand story, WhatsApp-driven order flow. Customers discover products and message the business directly to order.
2. **Operator dashboard** — order intake, kanban pipeline, customer CRM, inventory by batch, and analytics. The single place the business runs from.

## Architecture

| Layer | Tech |
|---|---|
| Frontend + API | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth (dashboard only) | Supabase Auth |
| Hosting | Netlify (frontend) + Supabase (DB) |

## Project status

**v1 — pre-license phase.** The business is in the process of obtaining its FSSAI food license. Until then, this site ships without:
- Online payment (Razorpay)
- Automated shipping (Shiprocket)
- Live WhatsApp Business API chatbot
- Marketing broadcast campaigns

These features are built and ready behind feature flags, to be switched on once the license is in hand.

## Local development

### Prerequisites
- Node.js 20+
- A Supabase project (free tier is fine)

### Setup
```bash
# Clone and install
git clone https://github.com/your-username/fh-spices.git
cd fh-spices
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase keys

# Run migrations in Supabase SQL Editor:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_seed_data.sql

# Start dev server
npm run dev
```

Site runs at http://localhost:3000.

## Project structure

```
src/
├── app/
│   ├── (public)/              # Customer-facing pages
│   │   ├── page.tsx           # Home
│   │   ├── products/
│   │   ├── story/
│   │   └── contact/
│   ├── (dashboard)/           # Operator dashboard (auth required)
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── inventory/
│   │   └── analytics/
│   └── layout.tsx
├── components/
│   ├── ui/                    # Reusable UI primitives
│   ├── public/                # Public site components
│   └── dashboard/             # Dashboard components
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── utils.ts
└── types/
    └── database.ts            # Schema types — single source of truth
```

## Deployment

Auto-deploys to Netlify on every push to `main`. No manual deploy step.

## License

Private. © 2026 FH Spices. Code authored by Arif Mohammad with permission to showcase as portfolio work.
