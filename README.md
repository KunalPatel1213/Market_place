TrustKart Marketplace

🚀 Project Launch Status: TrustKart is currently on hold for a few days. We are working behind the scenes to finalize everything and will be launching very soon! Stay tuned for updates.

TrustKart is a responsive handmade marketplace for independent makers and the people who want to discover their work. The landing page keeps the original TrustKart message and actions, while using a clean, typography-led composition inspired by the supplied visual reference. The hero intentionally has no image so the maker-first message remains the first-viewport focus.

🚀 Hackathon Build Note

This project was built in approximately 3 hours using vibe coding for a hackathon. The implementation focuses on a complete, usable product slice rather than a static landing page: visitors can browse products, add items to a cart, sign in or sign up, sell products, and complete a Stripe checkout flow when the backend and environment variables are configured.

✨ What Is Included

Responsive Landing Page: TrustKart home page with hero section, trust badges, marketplace categories, workflow, testimonials, and call-to-action sections.

Product Marketplace: Browse products with category filtering and visual cards at /marketplace.

Cart Management: Shared cart state with item quantities, updates, and total calculations at /cart.

Seller Flow: Interface for makers to list products at /sell.

Authentication: Clerk authentication routes at /sign-in and /sign-up, with local fallback links when Clerk is not configured.

Payment Processing: Stripe checkout integration with dedicated success and cancellation routes.

Django REST Backend: Backend API handling products, orders, authentication, payments, and Stripe webhooks.

Demo Seeding: Pre-configured command to seed initial demo products for testing.

🛠 Tech Stack

Frontend: Next.js 16 (App Router), React 19, TypeScript

Styling: Tailwind CSS v4, Lucide React Icons

Auth: Clerk (Optional for browsing, customizable)

Payments: Stripe API & Webhooks

Backend: Django & Django REST Framework

Database: SQLite (Local development)

💻 Run the Frontend

Install dependencies:

npm install


Start the development server:

npm run dev


Open http://localhost:3000 in your browser.

Useful Frontend Scripts:

npm run lint    # Run ESLint check
npm run build   # Create production build
npm run start   # Start production server


⚙️ Run the Backend

Navigate to the backend directory:

cd backend


Create and activate a virtual environment:

Windows:

python -m venv .venv
.venv\Scripts\activate


macOS/Linux:

python3 -m venv .venv
source .venv/bin/activate


Install required packages, migrate the database, seed demo data, and start server:

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_products
python manage.py runserver


The Django API will be accessible at http://127.0.0.1:8000. Refer to backend/README.md for detailed endpoint documentations.

🔐 Environment Variables

Create a .env.local file in the root directory of the frontend project and add the following keys:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret


Note: Never commit real secret keys or webhook secrets to public version control.

📐 Responsive Design Decisions

The hero section is centered and image-free, using fluid typography via CSS clamp() so the primary message remains clear across display sizes without overflowing. Navigation adapts to smaller devices with a collapsible menu, buttons stack gracefully on small viewports, and maker elements rewrap seamlessly across mobile, tablet, and desktop views.

📁 Project Structure

├── app/          # Next.js App Router routes, layouts, and global styles
├── components/   # UI components, landing sections, and marketplace cards
├── context/      # Shared React Context (Cart provider)
├── backend/      # Django REST API, models, payments, and Stripe webhooks
└── public/       # Static assets, icons, and media


📌 Development Status

The application is a functional prototype. Public deployment is temporarily on hold for a few days while final improvements are being made. We will be launching officially very soon. Local development and testing features remain fully operational.

🌐 Deployment & Learn More

Learn more about Next.js in the Next.js Documentation.

The application is optimized for quick deployment on the Vercel Platform.
