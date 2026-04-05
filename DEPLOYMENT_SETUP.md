# Azure Static Web Apps Deployment Setup

## Overview
This document guides you through setting up automated deployment to Azure Static Web Apps using the GitHub Actions CI/CD pipeline.

## Prerequisites
- GitHub repository with configured Actions
- Azure account (Plural Sight Sandbox for testing)
- Azure Static Web App resource already created

## Step-by-Step Setup

### 1. Create Azure Static Web App (if not already created)

In your Azure Portal:
1. Search for "Static Web Apps"
2. Click "Create"
3. Select your subscription and resource group
4. Name: `devops-horizon` (or your preferred name)
5. Region: Choose closest to you (e.g., East US)
6. Hosting plan: Free
7. Build Presets: React
8. App location: `/`
9. Output location: `dist`

### 2. Get the Deployment Token

1. Once the Static Web App is created, go to **Manage deployment token**
2. Copy the **Deployment token** (this is your API token)

### 3. Set Up GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the deployment token from step 2
6. Click **Add secret**

### 4. Verify Workflow Configuration

The `.github/workflows/cicd.yml` file includes:

**Build Stage:**
- Runs on: Ubuntu, Windows, macOS
- Installs dependencies (`npm ci`)
- Compiles React app (`npm run build`)
- Uploads `/dist` artifact

**Test Stage:**
- Runs on all OS matrices
- Downloads build artifact
- Executes tests (`npm test -- --watchAll=false`)

**Deploy Stage:**
- Runs on: Ubuntu only (after build & test pass)
- Downloads production build artifact
- Deploys to Azure Static Web Apps
- Only deploys on `main` and `develop` branch pushes

### 5. Trigger the Workflow

1. Push code to `main` or `develop` branch:
   ```bash
   git push origin main
   ```

2. Go to **Actions** tab in GitHub
3. Watch the workflow execute:
   - ✓ Build completes
   - ✓ Tests pass
   - ✓ Deploy uploads to Azure

### 6. Configure Branch Deployments (Optional)

By default, the workflow deploys from both `main` and `develop` branches. To customize:

Edit `.github/workflows/cicd.yml` and modify the deploy step:

```yaml
if: github.ref == 'refs/heads/main'  # Only main branch
```

Or:

```yaml
if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'  # Both branches
```

### 7. Monitor Deployment

After deploying to Azure Static Web Apps:

1. Go to your Azure Portal
2. Find your Static Web App resource
3. Click **Overview**
4. See the **URL** to access your deployed app
5. Check **Activity** for deployment history

## Troubleshooting

### Deployment Token Issues
- **Error**: `AZURE_STATIC_WEB_APPS_API_TOKEN` not found
- **Solution**: Ensure secret is added to GitHub Settings (not organization secrets)

### Build Failures
- Check Node.js version requirement (20.19.0 or higher)
- Run `npm ci` locally to verify dependencies install
- Run `npm run build` to verify build process

### Test Failures
- Run `npm test` locally to debug
- Check test configuration in `jest` section of package.json
- Verify all test files in `/tests` directory

### Token Expiration (Plural Sight Sandbox)
- Sandbox tokens expire after 4 hours
- Regenerate new deployment token when setting up new sandbox
- Update GitHub secret with new token

## Workflow Structure

```
Push to main/develop
    ↓
Build Job (3 OS parallel)
    ↓
Test Job (depends on Build, 3 OS parallel)
    ↓
Docker Job (optional, depends on Build & Test)
    ↓
Deploy Job (depends on Build & Test, Ubuntu only)
    ↓
Azure Static Web App Updated
```

## Environment-Specific Deployments

The current workflow deploys to the same Azure Static Web Apps from both `main` and `develop`. To have separate staging/production environments:

Create two separate Azure Static Web App resources and update the workflow:

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  # ... deploy to staging

deploy-production:
  if: github.ref == 'refs/heads/main'
  # ... deploy to production
```

## Testing Locally

Before pushing, test the build and test locally:

```bash
# Install dependencies
npm ci

# Build the app
npm run build

# Run tests
npm test -- --watchAll=false

# Preview the built app
npm run preview
```

## Video Recording Notes

For recording the deployment process:
1. Start with showing GitHub Actions in the `Actions` tab
2. Capture the workflow execution (Build → Test → Deploy)
3. Show Azure Portal confirming deployment
4. Show the live app URL working

Typical execution time: 3-5 minutes per complete workflow run.
