# Inventory & Order Management System

A production-ready full-stack application for managing products, customers, orders, and inventory tracking.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI, SQLAlchemy |
| Frontend | React 18, Vite, React Router |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |

## Features

- **Product management** — CRUD with unique SKU validation and non-negative stock
- **Customer management** — Create, list, view, delete with unique email validation
- **Order management** — Multi-item orders with automatic total calculation and stock reduction
- **Inventory rules** — Orders blocked when stock is insufficient; stock restored on cancellation
- **Dashboard** — Summary stats and low-stock alerts
- **Responsive UI** — Works on desktop and mobile

## Project Structure

```
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── routers/   # API route handlers
│   │   ├── models.py  # SQLAlchemy models
│   │   └── schemas.py # Pydantic validation
│   └── Dockerfile
├── frontend/          # React application
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── render.yaml        # Render deployment blueprint
```

## Quick Start (Docker Compose)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run locally

1. Clone the repository and navigate to the project root.

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start all services:

   ```bash
   docker compose up --build
   ```

4. Access the application:

   | Service | URL |
   |---------|-----|
   | Frontend | http://localhost |
   | Backend API | http://localhost:8000 |
   | API Docs (Swagger) | http://localhost:8000/docs |

5. Stop services:

   ```bash
   docker compose down
   ```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/{id}` | Get product by ID |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create customer |
| GET | `/customers` | List all customers |
| GET | `/customers/{id}` | Get customer by ID |
| DELETE | `/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order (auto-calculates total, reduces stock) |
| GET | `/orders` | List all orders |
| GET | `/orders/{id}` | Get order details |
| DELETE | `/orders/{id}` | Cancel order (restores stock) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Summary stats and low-stock products |

## Business Rules

- Product SKU must be unique
- Customer email must be unique
- Product quantity cannot be negative
- Orders cannot be placed if inventory is insufficient
- Creating an order automatically reduces available stock
- Order total is calculated by the backend
- Cancelling an order restores product stock

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://inventory:inventory@db:5432/inventory_db` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,http://localhost:3000` |
| `LOW_STOCK_THRESHOLD` | Threshold for low-stock alerts | `10` |
| `VITE_API_URL` | Backend URL for frontend (build-time) | `http://localhost:8000` |

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step GitHub, Render, Netlify, and Docker Hub instructions.

Fill in live URLs in **[SUBMISSION.md](./SUBMISSION.md)** after deploying.

Quick publish script (after creating GitHub repo):

```powershell
.\scripts\publish.ps1 -GitHubUsername "YOUR_USERNAME"
```

### Backend — Render (Free Tier)

1. Push code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository and use the `render.yaml` blueprint, or configure manually:
   - **Runtime:** Docker
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Docker Context:** `./backend`
4. Add a **PostgreSQL** database (free tier) and link `DATABASE_URL`.
5. Set environment variable:
   - `CORS_ORIGINS` = your frontend URL (e.g. `https://your-app.netlify.app`)
6. Deploy and note the backend URL (e.g. `https://inventory-backend.onrender.com`).

### Backend — Docker Hub (Requirement 2)

**Recommended:** GitHub Actions (no local Docker needed). See **[docs/DOCKERHUB_SETUP.md](./docs/DOCKERHUB_SETUP.md)**.

Quick setup — run in PowerShell (opens required browser pages):

```powershell
.\scripts\setup-dockerhub.ps1 -DockerHubUsername "YOUR_DOCKERHUB_USERNAME"
```

Add GitHub secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`, then run the **Publish Backend to Docker Hub** workflow.

**Alternative — local Docker Desktop:**

Build and push the backend image:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-backend:latest ./backend
docker push YOUR_DOCKERHUB_USERNAME/inventory-backend:latest
```

### Frontend — Netlify (Free Tier)

1. Create a site on [Netlify](https://netlify.com) connected to your GitHub repo.
2. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. Set environment variable:
   - `VITE_API_URL` = your deployed backend URL (e.g. `https://inventory-backend.onrender.com`)
4. Deploy and note the frontend URL.

### Frontend — Vercel (Alternative)

1. Import the repo on [Vercel](https://vercel.com).
2. Set root directory to `frontend`.
3. Add `VITE_API_URL` environment variable pointing to your backend.
4. Deploy.

### Post-Deployment Checklist

- [ ] Backend `/health` returns `{"status": "healthy"}`
- [ ] Backend `/docs` is accessible
- [ ] Frontend loads and shows dashboard data
- [ ] Update `CORS_ORIGINS` on backend with frontend URL
- [ ] Rebuild/redeploy frontend with correct `VITE_API_URL`

## Local Development (Without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Start PostgreSQL and set DATABASE_URL
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

## Submission Checklist

- [ ] GitHub repository with frontend and backend code
- [ ] Docker Hub image link for backend
- [ ] Live frontend deployment URL
- [ ] Live backend API URL

## License

MIT
