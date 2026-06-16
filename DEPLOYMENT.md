# Deployment Guide: EIPs Bootcamp

This guide outlines the strategies and steps for deploying the EIPs Bootcamp monorepo to production.

## Architecture Overview

The project is a monorepo containing:
- **Frontend:** Next.js 15 (`apps/web`)
- **Backend:** NestJS 11 (`apps/api`)
- **Database:** PostgreSQL (via Prisma)

---

## Strategy 1: Recommended (Hybrid Deployment)

This is the industry-standard approach for NestJS + Next.js projects. It ensures the backend remains persistent and high-performing while leveraging Vercel's edge network for the frontend.

### 1. Frontend: Deploying to Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Create a new project for the **Frontend**.
3. **Settings:**
   - **Root Directory:** `apps/web`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Install Command:** `pnpm install`
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: `https://api.ethshala.com`
   - `BETTER_AUTH_SECRET`: Your generated secret
   - `BETTER_AUTH_URL`: `https://ethshala.com`
   - `DATABASE_URL`: Your PostgreSQL connection string (if using server-side DB calls in Next.js)

### 2. Backend: Deploying to a Persistent Provider
Use a provider like **Railway**, **Render**, or **DigitalOcean App Platform**.

1. Connect your GitHub repository to the provider.
2. Create a new service for the **Backend**.
3. **Settings:**
   - **Root Directory:** `apps/api`
   - **Build Command:** `pnpm build`
   - **Start Command:** `pnpm start:prod` (or `node dist/main`)
4. **Environment Variables:**
   - `PORT`: `8080` (usually provided by the platform)
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `CORS_ORIGIN`: `https://ethshala.com` (Your Vercel URL)

---

## Strategy 2: All-on-Vercel (Monorepo)

Vercel can host the backend as **Serverless Functions**, but this requires specific configuration.

### 1. Configuration Changes
You will need a `vercel.json` in `apps/api` to route requests to the NestJS app.

### 2. Limitations
- **Cold Starts:** The API may have a 1-2 second delay on the first request after inactivity.
- **Database Connections:** Prisma can exhaust PostgreSQL connections quickly in serverless environments. **Solution:** Use a connection pooling tool like **Prisma Accelerate** or **Supabase Connection Pooling**.

---

## Critical Configuration: CORS

For the frontend to communicate with the backend, you must configure Cross-Origin Resource Sharing (CORS) in `apps/api/src/main.ts`.

Update your `bootstrap` function:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'https://ethshala.com',
  credentials: true,
});
```

---

## Database Migration

Regardless of the provider, you must run migrations during your build/deploy process:

```bash
# In your deployment build command or post-install script:
npx prisma generate
npx prisma db push # Or prisma migrate deploy for production
```

## Summary Table

| Feature | Vercel (Frontend) | Railway/Render (Backend) |
| :--- | :--- | :--- |
| **Primary Use** | UI, Static Assets, SSR | API, Database, Jobs |
| **Performance** | Edge-optimized | Persistent connectivity |
| **Reliability** | High | High (Handles WebSockets/Long Tasks) |
| **Cost** | Free/Paid tiers | Pay-as-you-go |

---

## Post-Deployment Checklist
1. [ ] Verify `NEXT_PUBLIC_API_URL` is set correctly on the Frontend.
2. [ ] Verify `CORS_ORIGIN` matches the Frontend domain on the Backend.
3. [ ] Ensure the Database is reachable from both providers.
4. [ ] Test the Authentication flow (Better Auth) on the production domain.
