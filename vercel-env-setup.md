# Vercel Environment Setup Guide

## Step 1: Get Your Render Backend URL
1. Go to your Render dashboard: https://dashboard.render.com
2. Find your backend service (cosearch-backend)
3. Copy the URL (should be like `https://cosearch-backend-xxxx.onrender.com`)

## Step 2: Set Environment Variable in Vercel
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your CoSearch project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-render-backend-url.onrender.com/api
   Environment: Production
   ```
5. Click **Save**

## Step 3: Redeploy
1. Go to **Deployments** in Vercel
2. Click **Redeploy** on the latest deployment

## Expected Result
- ✅ JavaScript modules will load properly
- ✅ Frontend will connect to your Render backend
- ✅ No more blank page or MIME type errors

## Troubleshooting
If you still see MIME type errors:
1. Clear your browser cache
2. Try opening in incognito mode
3. Check the browser's Network tab to see if assets are loading 