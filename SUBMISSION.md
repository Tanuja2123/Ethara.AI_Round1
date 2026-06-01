# Submission URLs

Fill in after completing deployment steps in DEPLOYMENT.md.

| Deliverable | URL |
|-------------|-----|
| **GitHub Repository** | https://github.com/Tanuja2123/Ethara.AI_Round1 |
| **Docker Hub Image** | https://hub.docker.com/r/Tanuja2123/inventory-backend *(after GitHub Actions publish — see docs/DOCKERHUB_SETUP.md)* |
| **Live Frontend** | https://YOUR-SITE.netlify.app |
| **Live Backend API** | https://YOUR-BACKEND.onrender.com |

## Quick deploy commands

### GitHub push (after creating repo on github.com)

```powershell
cd c:\Users\TanujaSharmaMAQSoftw\Downloads\Ethara.AI_Round1
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-order-management.git
git push -u origin main
```

### Docker Hub (after installing Docker Desktop)

```powershell
docker login
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-backend:latest ./backend
docker push YOUR_DOCKERHUB_USERNAME/inventory-backend:latest
```

### Netlify env var

```
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

### Render env vars

```
DATABASE_URL=<from Render PostgreSQL>
CORS_ORIGINS=https://YOUR-SITE.netlify.app
LOW_STOCK_THRESHOLD=10
```
