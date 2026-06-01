#Requires -Version 5.1
<#
.SYNOPSIS
  Helper script for GitHub push and Docker Hub publish.

.USAGE
  1. Create a GitHub repo at https://github.com/new (empty, no README)
  2. Run: .\scripts\publish.ps1 -GitHubUsername "your-username"

  For Docker Hub (requires Docker Desktop):
  .\scripts\publish.ps1 -GitHubUsername "your-username" -DockerHubUsername "your-dockerhub-user" -PushDocker
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$GitHubUsername,

    [string]$RepoName = "inventory-order-management",

    [string]$DockerHubUsername = "",

    [switch]$PushDocker
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host "=== Inventory System Publish Helper ===" -ForegroundColor Cyan

# Ensure on main branch
git branch -M main 2>$null

# Check for remote
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    $remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
    Write-Host "Adding remote: $remoteUrl"
    git remote add origin $remoteUrl
} else {
    Write-Host "Remote already set: $remote"
}

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nPush failed. Common fixes:" -ForegroundColor Red
    Write-Host "  1. Create repo: https://github.com/new?name=$RepoName"
    Write-Host "  2. Sign in: git may prompt for GitHub username + Personal Access Token"
    Write-Host "  3. Set commit identity (one-time):"
    Write-Host "     git config user.name `"Your Name`""
    Write-Host "     git config user.email `"you@example.com`""
    exit 1
}

Write-Host "GitHub push successful!" -ForegroundColor Green
Write-Host "Repository: https://github.com/$GitHubUsername/$RepoName"

# Docker Hub
if ($PushDocker) {
    if (-not $DockerHubUsername) {
        Write-Host "DockerHubUsername required when using -PushDocker" -ForegroundColor Red
        exit 1
    }

    $docker = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $docker) {
        Write-Host "Docker not found. Install Docker Desktop:" -ForegroundColor Red
        Write-Host "  https://www.docker.com/products/docker-desktop/"
        exit 1
    }

    $image = "${DockerHubUsername}/inventory-backend:latest"
    Write-Host "`nBuilding Docker image: $image" -ForegroundColor Yellow
    docker build -t $image ./backend
    docker push $image

    Write-Host "Docker Hub image published!" -ForegroundColor Green
    Write-Host "https://hub.docker.com/r/$DockerHubUsername/inventory-backend"
}

Write-Host "`n=== Next: Deploy on Render + Netlify ===" -ForegroundColor Cyan
Write-Host "See DEPLOYMENT.md for step-by-step instructions."
