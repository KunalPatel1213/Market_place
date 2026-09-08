# TrustKart API

Django REST Framework backend for the TrustKart marketplace. The API uses Clerk bearer JWTs for protected requests, synchronizes the Clerk subject to the local `api.User` record, and creates hosted Stripe Checkout Sessions for orders.

## Local setup

```powershell
cd backend
.venv\Scripts\Activate.ps1
Copy-Item .env.example .env
python manage.py migrate
python manage.py runserver
```

The API runs at `http://localhost:8000`.

## Configuration

Set `CLERK_JWKS_URL` and `CLERK_ISSUER` to the values from the Clerk instance that issues the frontend tokens. The backend expects `Authorization: Bearer <clerk-jwt>` on protected requests. `DB_ENGINE=sqlite` is suitable for local development; set it to `postgres` and provide the `POSTGRES_*` values for deployment.

Set `STRIPE_SECRET_KEY` to enable checkout. Set `FRONTEND_URL=http://localhost:3000` locally. Register `POST /api/webhooks/stripe/` with Stripe and set `STRIPE_WEBHOOK_SECRET`. For local development, authenticate the Stripe CLI and run:

```powershell
stripe login
stripe listen --forward-to localhost:8000/api/webhooks/stripe/
```

Copy the generated `whsec_...` value into `backend/.env`, then restart Django. The webhook verifies Stripe signatures, marks completed Checkout Sessions paid, and decrements stock exactly once.

## API surface

- `GET /api/health/` - public liveness check
- `GET /api/categories/` - public category list
- `GET /api/products/` - public product list; supports `category` and `search`
- `POST /api/products/` - authenticated seller product creation
- `POST /api/payments/create-checkout-session/` - authenticated hosted Checkout creation; body: `{ "items": [{ "productId": 1, "quantity": 2 }] }`
- `POST /api/webhooks/stripe/` - signature-verified Stripe webhook receiver
- `/admin/` - Django admin

Run the test suite with:

```powershell
python manage.py test
```
