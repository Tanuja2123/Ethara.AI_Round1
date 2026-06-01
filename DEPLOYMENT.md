# Deployment Guide

Step-by-step instructions to publish the Inventory & Order Management System.

## Prerequisites

- GitHub account
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Docker Hub image)
- [Render](https://render.com) account (backend + PostgreSQL)
- [Netlify](https://netlify.com) or [Vercel](https://vercel.com) account (frontend)

---

## Step 1: Push to GitHub

### 1.1 Create a repository on GitHub

1. Go to https://github.com/new
2. Repository name: `inventory-order-management` (or your choice)
3. Set visibility: **Public** (required for free Netlify/Render from private repos on free tier may vary)
4. **Do not** initialize with README (code already exists locally)
5. Click **Create repository**

### 1.2 Push local code

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
cd c:\Users\TanujaSharmaMAQSoftw\Downloads\Ethara.AI_Round1

git add .
git commit -m "Add production-ready inventory and order management system"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-order-management.git
git push -u origin main
```

If prompted, sign in with GitHub credentials or a Personal Access Token (PAT).

**Create a PAT:** GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic) → scope: `repo`.

---

## Step 2: Deploy Backend on Render

### 2.1 Create PostgreSQL database

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Name: `inventory-db`
4. Plan: **Free**
5. Click **Create Database**
6. Copy the **Internal Database URL** (or External if needed)

### 2.2 Create Web Service (Backend)

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:

   | Setting | Value |
   |---------|-------|
   | Name | `inventory-backend` |
   | Region | Choose nearest |
   | Branch | `main` |
   | Root Directory | *(leave empty)* |
   | Runtime | **Docker** |
   | Dockerfile Path | `./backend/Dockerfile` |
   | Docker Context | `./backend` |
   | Plan | **Free** |

4. **Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Paste from PostgreSQL (Render auto-links if using Blueprint) |
   | `CORS_ORIGINS` | `https://YOUR-NETLIFY-SITE.netlify.app` *(update after frontend deploy)* |
   | `LOW_STOCK_THRESHOLD` | `10` |

5. Click **Create Web Service**
6. Wait for deploy (~5–10 min on free tier)
7. Note your backend URL: `https://inventory-backend-xxxx.onrender.com`

### 2.3 Verify backend

Open in browser:

- `https://YOUR-BACKEND.onrender.com/health` → `{"status":"healthy"}`
- `https://YOUR-BACKEND.onrender.com/docs` → Swagger UI

### Alternative: Use Render Blueprint

1. **New +** → **Blueprint**
2. Connect repo — Render reads `render.yaml`
3. Set `CORS_ORIGINS` when prompted
4. Deploy

---

## Step 3: Deploy Frontend on Netlify

### 3.1 Create site

1. Log in to [Netlify](https://app.netlify.com)
2. **Add new site** → **Import an existing project**
3. Connect **GitHub** and select your repository

### 3.2 Build settings

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

### 3.3 Environment variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com` *(no trailing slash)* |

### 3.4 Deploy

1. Click **Deploy site**
2. Note your URL: `https://random-name.netlify.app`
3. Optional: **Site settings** → **Change site name** → e.g. `inventory-order-mgmt`

### 3.5 Update backend CORS

1. Return to Render → your backend service → **Environment**
2. Set `CORS_ORIGINS` to your Netlify URL: `https://your-site.netlify.app`
3. Save — Render redeploys automatically

### 3.6 Redeploy frontend (if backend URL changed)

Netlify → **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## Step 4: Frontend on Vercel (Alternative)

1. Import repo at [vercel.com/new](https://vercel.com/new)
2. Root Directory: `frontend`
3. Framework Preset: **Vite**
4. Environment Variable: `VITE_API_URL` = your Render backend URL
5. Deploy
6. Update `CORS_ORIGINS` on Render with Vercel URL

---

## Step 5: Push Backend Image to Docker Hub

### 5.1 Install Docker Desktop

Download: https://www.docker.com/products/docker-desktop/

### 5.2 Create Docker Hub account

1. Sign up at https://hub.docker.com
2. Create repository: `inventory-backend` (public)

### 5.3 Build and push

Replace `YOUR_DOCKERHUB_USERNAME`:

```powershell
cd c:\Users\TanujaSharmaMAQSoftw\Downloads\Ethara.AI_Round1

docker login

docker build -t YOUR_DOCKERHUB_USERNAME/inventory-backend:latest ./backend
docker push YOUR_DOCKERHUB_USERNAME/inventory-backend:latest
```

Your Docker Hub link: `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/inventory-backend`

### Optional: GitHub Actions auto-publish

Add GitHub repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (Docker Hub → Account Settings → Security → Access Tokens)

Push to `main` — workflow in `.github/workflows/docker-publish.yml` publishes the image.

---

## Step 6: Final verification

| Check | Expected |
|-------|----------|
| Backend `/health` | `{"status":"healthy"}` |
| Backend `/docs` | Swagger loads |
| Frontend dashboard | Shows stats (may be zeros initially) |
| Create product | Success message |
| Create customer | Success message |
| Create order | Stock reduces, total calculated |
| Insufficient stock order | Error message |

---

## Submission template

Fill in after deployment:

```
GitHub Repository: https://github.com/YOUR_USERNAME/inventory-order-management
Docker Hub Image:  https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/inventory-backend
Live Frontend URL: https://YOUR-SITE.netlify.app
Live Backend URL:  https://YOUR-BACKEND.onrender.com
```

---

## Troubleshooting

### Frontend shows "Failed to load dashboard"

- Confirm `VITE_API_URL` is set correctly on Netlify/Vercel
- Redeploy frontend after changing env vars (Vite bakes them at build time)
- Check browser DevTools → Network for CORS errors

### CORS errors

- Set `CORS_ORIGINS` on Render to exact frontend URL (no trailing slash)
- Include `https://` prefix

### Render backend sleeps (free tier)

- First request after idle may take 30–60 seconds
- Health check path: `/health`

### Database connection failed

- Ensure `DATABASE_URL` uses `postgresql://` (app auto-converts `postgres://`)
- On Render, link database to web service or paste Internal Database URL
