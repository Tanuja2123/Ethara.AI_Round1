# Render Backend — Fresh Deploy Guide

Use this guide to delete the old Render service and redeploy from scratch.

## Project structure (backend)

```
Ethara.AI_Round1/
├── backend/                  ← Render Root Directory
│   ├── Dockerfile            ← Render Dockerfile Path
│   ├── .dockerignore
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       └── routers/
│           ├── products.py
│           ├── customers.py
│           ├── orders.py
│           └── dashboard.py
├── frontend/                 ← Netlify only (not used by Render)
├── render.yaml
└── docker-compose.yml
```

---

## Step 1 — Delete old Render service (optional but recommended)

1. Open https://dashboard.render.com
2. Open your old backend service (e.g. `Ethara.AI_Round1-backend`)
3. **Settings** → scroll down → **Delete Web Service**
4. Confirm deletion

---

## Step 2 — Create a new Web Service

1. **New +** → **Web Service**
2. Connect GitHub repo: **`Tanuja2123/Ethara.AI_Round1`**
   - Must be **`Ethara.AI_Round1`** (dot), not `Ethara_AI_Round1`
3. Use these **exact** build settings:

| Setting | Value |
|---------|--------|
| **Name** | `ethara-inventory-backend` |
| **Region** | Closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `Dockerfile` |
| **Docker Build Context Directory** | `.` |
| **Instance Type** | **Free** |

> **Important:** With Root Directory = `backend`, the Dockerfile path is **`Dockerfile`** (not `./backend/Dockerfile`).

---

## Step 3 — Environment variables

In **Environment**, add:

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Neon connection string | `postgresql://user:pass@host/neondb?sslmode=require` |
| `CORS_ORIGINS` | Netlify frontend URL | `https://etharaairound1.netlify.app` |
| `LOW_STOCK_THRESHOLD` | `10` | `10` |

**Notes:**
- `DATABASE_URL` must include `?sslmode=require` for Neon
- `CORS_ORIGINS` must start with `https://` and match your Netlify URL exactly (no trailing slash)
- Use the **same** Neon `DATABASE_URL` as local `.env` to keep your existing products/customers

---

## Step 4 — Deploy and verify

1. Click **Create Web Service**
2. Wait 5–10 minutes for first deploy
3. Test these URLs (replace with your Render URL):

```
https://YOUR-SERVICE.onrender.com/health
https://YOUR-SERVICE.onrender.com/docs
https://YOUR-SERVICE.onrender.com/products
```

**Expected:**
- `/health` → `{"status":"healthy"}`
- `/products` → JSON array (your Neon data if same DATABASE_URL)

---

## Step 5 — Update Netlify

In Netlify → **Environment variables**:

```
VITE_API_URL=https://YOUR-SERVICE.onrender.com
```

Must include **`https://`** — no trailing slash.

Then: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `COPY app ./app: not found` | Root Directory must be `backend`, Dockerfile Path = `Dockerfile` |
| Build fails immediately | Wrong repo name or GitHub access — reconnect repo |
| `Failed to fetch` on Netlify | Fix `VITE_API_URL` (https) and `CORS_ORIGINS` on Render, redeploy both |
| Empty products on live site | Render `DATABASE_URL` differs from local Neon URL |
| First request very slow | Normal on Render free tier (cold start ~30–60s) |

---

## Alternative: Render Blueprint

1. **New +** → **Blueprint**
2. Connect repo `Ethara.AI_Round1`
3. Render reads `render.yaml` automatically
4. Enter `DATABASE_URL` and `CORS_ORIGINS` when prompted

---

## GitHub sync check

```powershell
cd c:\Users\TanujaSharmaMAQSoftw\Downloads\Ethara.AI_Round1
git pull
git status
```

Should show: `Your branch is up to date with 'origin/main'`.
