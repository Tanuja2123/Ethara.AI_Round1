#Requires -Version 5.1
<#
.SYNOPSIS
  Opens browser pages to complete Docker Hub + GitHub Actions setup (Requirement 2).

.EXAMPLE
  .\scripts\setup-dockerhub.ps1
  .\scripts\setup-dockerhub.ps1 -DockerHubUsername "Tanuja2123"
#>

param(
    [string]$DockerHubUsername = "Tanuja2123",
    [string]$GitHubRepo = "Tanuja2123/Ethara.AI_Round1"
)

Write-Host "=== Docker Hub Requirement 2 Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Follow these steps in order:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create Docker Hub repo 'inventory-backend' (public)"
Write-Host "2. Create Docker Hub access token (Read/Write)"
Write-Host "3. Add GitHub secrets: DOCKERHUB_USERNAME and DOCKERHUB_TOKEN"
Write-Host "4. Run the GitHub Actions workflow"
Write-Host ""

$urls = @(
    @{ Label = "Docker Hub - Create Repository"; Url = "https://hub.docker.com/repository/create" },
    @{ Label = "Docker Hub - Access Tokens"; Url = "https://hub.docker.com/settings/security" },
    @{ Label = "GitHub - Actions Secrets"; Url = "https://github.com/$GitHubRepo/settings/secrets/actions" },
    @{ Label = "GitHub - Run Workflow"; Url = "https://github.com/$GitHubRepo/actions/workflows/docker-publish.yml" },
    @{ Label = "Your Docker Hub Image (after publish)"; Url = "https://hub.docker.com/r/$DockerHubUsername/inventory-backend" }
)

foreach ($item in $urls) {
    Write-Host "Opening: $($item.Label)" -ForegroundColor Green
    Start-Process $item.Url
    Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "GitHub secrets to add:" -ForegroundColor Cyan
Write-Host "  DOCKERHUB_USERNAME = $DockerHubUsername"
Write-Host "  DOCKERHUB_TOKEN    = (paste token from Docker Hub)"
Write-Host ""
Write-Host "After secrets are saved, click 'Run workflow' on the Actions page." -ForegroundColor Yellow
Write-Host "Full guide: docs/DOCKERHUB_SETUP.md"
