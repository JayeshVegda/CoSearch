# Vercel Environment Variables Setup

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

## Example Configuration

If your Render backend URL is `https://cosearch-backend-abc123.onrender.com`, then set:

```
Name: VITE_API_BASE_URL
Value: https://cosearch-backend-abc123.onrender.com/api
Environment: Production
```

## Step 3: Redeploy

1. Go to **Deployments** in Vercel
2. Click **Redeploy** on the latest deployment

## Expected Result

- ✅ Frontend will connect to your Render backend
- ✅ API calls will work properly
- ✅ No more CORS errors

## Troubleshooting

If you still see API errors:
1. Check the browser's Network tab
2. Verify the API URL is correct
3. Make sure your Render backend is running
4. Check if CORS is properly configured on the backend

## Backend CORS Update

You'll also need to update your backend's CORS_ORIGIN to your new Vercel URL:

1. Go to your Render backend environment variables
2. Update `CORS_ORIGIN` to your new Vercel URL (e.g., `https://co-search.vercel.app`) 