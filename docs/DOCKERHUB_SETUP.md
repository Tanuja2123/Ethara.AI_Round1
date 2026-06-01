# Docker Hub Setup — Complete Requirement 2

This guide publishes the backend image to Docker Hub using **GitHub Actions** (no local Docker required).

## Step 1: Create Docker Hub account & repository

1. Sign up / log in at https://hub.docker.com
2. Click **Create Repository**
   - Name: `inventory-backend`
   - Visibility: **Public**
3. Note your Docker Hub username (e.g. `Tanuja2123`)

## Step 2: Create Docker Hub access token

1. Docker Hub → **Account Settings** → **Security** → **New Access Token**
2. Description: `github-actions`
3. Permissions: **Read, Write, Delete**
4. Copy the token (shown once)

## Step 3: Add GitHub repository secrets

1. Open https://github.com/Tanuja2123/Ethara.AI_Round1/settings/secrets/actions
2. Click **New repository secret** and add:

| Name | Value |
|------|-------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Token from Step 2 |

## Step 4: Trigger the publish workflow

1. Open https://github.com/Tanuja2123/Ethara.AI_Round1/actions/workflows/docker-publish.yml
2. Click **Run workflow** → **Run workflow**

Or push any change to `main` — the workflow runs automatically.

## Step 5: Verify

After the workflow succeeds (~2–3 min):

- Image URL: `https://hub.docker.com/r/YOUR_USERNAME/inventory-backend`
- Pull test: `docker pull YOUR_USERNAME/inventory-backend:latest`

---

## Alternative: Local push (requires Docker Desktop)

After Docker Desktop is installed and running:

```powershell
cd c:\Users\TanujaSharmaMAQSoftw\Downloads\Ethara.AI_Round1
docker login
docker build -t YOUR_USERNAME/inventory-backend:latest ./backend
docker push YOUR_USERNAME/inventory-backend:latest
```

Or use the helper script:

```powershell
.\scripts\publish.ps1 -GitHubUsername "Tanuja2123" -DockerHubUsername "YOUR_USERNAME" -PushDocker
```
