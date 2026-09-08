# TrustKart Marketplace

TrustKart is a responsive handmade marketplace for independent makers and the people who want to discover their work. The landing page keeps the original TrustKart message and actions, while using a clean, typography-led composition inspired by the supplied visual reference. The hero intentionally has no image so the maker-first message remains the first-viewport focus.

## Hackathon Build Note

This project was built in approximately **2 hours using vibe coding for a hackathon**. The implementation focuses on a complete, usable product slice rather than a static landing page: visitors can browse products, add items to a cart, sign in or sign up, sell products, and complete a Stripe checkout flow when the backend and environment variables are configured.

## What Is Included

- Responsive TrustKart home page with hero, trust badges, marketplace categories, workflow, testimonials, and call-to-action sections.
- Product marketplace at `/marketplace` with filtering and product cards.
- Shared cart state with item quantities and totals at `/cart`.
- Seller listing flow at `/sell`.
- Clerk authentication routes at `/sign-in` and `/sign-up`, with local fallback links when Clerk is not configured.
- Stripe checkout integration with success and cancel states.
- Django REST backend for products, orders, authentication, payments, and Stripe webhooks.
- Demo product seeding command for local development.

## Tech Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Lucide React icons
- Clerk for optional authentication
- Stripe for payments
- Django and Django REST Framework backend
- SQLite for local development

## Run the Frontend

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
npm run lint
npm run build
npm run start
```

## Run the Backend

From the `backend` directory, create or activate a virtual environment, install dependencies, and run migrations:

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_products
python manage.py runserver
```

The Django API is available at [http://127.0.0.1:8000](http://127.0.0.1:8000). See `backend/README.md` for the API-specific setup and endpoint details.

## Environment Variables

Copy the required values into `.env.local` for the frontend. Clerk is optional for browsing the app, while Stripe is required for real checkout sessions.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Never commit real keys or webhook secrets.

## Responsive Design Decisions

The home hero is centered and image-free, with fluid heading sizing through `clamp()` so the main message stays prominent without overflowing. Buttons stack on small screens, maker avatars wrap naturally, and the navigation switches to a compact menu. The remaining sections use the same responsive Tailwind breakpoints so content remains readable on phones, tablets, and desktop displays.

## Project Structure

```text
app/          Next.js routes and global styles
components/   Reusable marketplace and landing-page sections
context/      Shared cart provider
backend/      Django API, models, payments, and webhooks
public/       Static assets
```

## Development Status

The application is a hackathon-ready prototype. Product browsing and cart behavior work locally, while Clerk and Stripe features become fully active after their environment variables and backend configuration are supplied.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
