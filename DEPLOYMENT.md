# Deployment Guide - Vercel

This guide walks you through deploying the Short-Let Web application to Vercel. The application consists of two parts:
1. **Frontend** (React + Vite + TypeScript)
2. **Backend** (Node.js + Express API)

## Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier works fine)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) (for production database)
- [Paystack Account](https://dashboard.paystack.com) (for payment processing)
- [Cloudinary Account](https://cloudinary.com/users/register/free) (for image uploads)
- GitHub repository with your code

---

## Part 1: Deploy the Backend API

### Step 1: Prepare Backend for Deployment

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Verify the `vercel.json` file exists:**
   The file should already be created at `backend/vercel.json` with the following content:
   ```json
   {
     "version": 2,
     "name": "short-let-api",
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

### Step 2: Deploy Backend to Vercel

1. **Install Vercel CLI** (optional, but recommended):
   ```bash
   npm install -g vercel
   ```

2. **Deploy using Vercel CLI:**
   ```bash
   cd backend
   vercel
   ```
   
   Or **deploy using Vercel Dashboard:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Set **Root Directory** to `backend`
   - Click **Deploy**

3. **Note your backend URL** (it will be something like):
   ```
   https://your-backend-api.vercel.app
   ```

### Step 3: Configure Backend Environment Variables

In Vercel Dashboard → Your Backend Project → Settings → Environment Variables, add:

#### Required Variables:

| Variable Name | Example Value | Where to Get It |
|--------------|---------------|-----------------|
| `NODE_ENV` | `production` | Fixed value |
| `PORT` | `5001` | Fixed value |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/db` | [MongoDB Atlas](https://cloud.mongodb.com) |
| `JWT_SECRET` | `your_strong_random_secret_32_chars` | Generate using: `openssl rand -base64 32` |
| `JWT_EXPIRE` | `7d` | Fixed value (7 days) |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | `123456789012345` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary Dashboard |
| `EMAIL_HOST` | `smtp.gmail.com` | Your email provider |
| `EMAIL_PORT` | `587` | Email provider port |
| `EMAIL_USER` | `your-email@gmail.com` | Your email address |
| `EMAIL_PASSWORD` | `your_app_password` | [Gmail App Password](https://support.google.com/accounts/answer/185833) |
| `EMAIL_FROM` | `noreply@yourapp.com` | Your sender email |
| `PAYSTACK_SECRET_KEY` | `sk_live_xxxxx` | [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developers) (use **LIVE** key for production) |
| `PAYSTACK_PUBLIC_KEY` | `pk_live_xxxxx` | Paystack Dashboard (use **LIVE** key) |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Your frontend URL (add after frontend deployment) |

#### Important Notes:
- **Use LIVE Paystack keys** (not test keys) for production
- Generate a strong JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Make sure MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs) in Network Access

### Step 4: Redeploy Backend

After adding environment variables, trigger a redeployment:
```bash
vercel --prod
```

Or redeploy from Vercel Dashboard → Deployments → Click "Redeploy"

---

## Part 2: Deploy the Frontend

### Step 1: Prepare Frontend for Deployment

1. **Navigate to the root directory:**
   ```bash
   cd /Users/adedamolaagunbiade/Documents/Apps/short-let-web
   ```

2. **Verify the `vercel.json` file exists:**
   The file should already be created at the root with the following content:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/assets/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ]
   }
   ```

### Step 2: Deploy Frontend to Vercel

1. **Deploy using Vercel CLI:**
   ```bash
   vercel
   ```
   
   Or **deploy using Vercel Dashboard:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Set **Root Directory** to `./` (root)
   - Click **Deploy**

2. **Note your frontend URL** (it will be something like):
   ```
   https://your-app.vercel.app
   ```

### Step 3: Configure Frontend Environment Variables

In Vercel Dashboard → Your Frontend Project → Settings → Environment Variables, add:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `VITE_API_URL` | `https://your-backend-api.vercel.app` | Your backend API URL from Part 1 |
| `VITE_APP_URL` | `https://your-app.vercel.app` | Your frontend URL |

**Note:** Paystack credentials are NOT needed on the frontend. All payment processing is handled securely by the backend API.

### Step 4: Redeploy Frontend

After adding environment variables:
```bash
vercel --prod
```

Or redeploy from Vercel Dashboard.

---

## Part 3: Update Backend CORS

Now that you have your frontend URL, update the backend to allow requests from it.

### Option 1: Update via Environment Variable

Go to Vercel Dashboard → Backend Project → Settings → Environment Variables:
- **Update** `FRONTEND_URL` to your actual frontend URL: `https://your-app.vercel.app`
- **Redeploy** the backend

### Option 2: Update CORS in Code (if needed)

If you need more control, you can update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://your-app.vercel.app', // Add your production URL
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));
```

---

## Part 4: Configure Paystack Webhook

To receive payment notifications, configure Paystack webhook:

1. Go to [Paystack Dashboard → Settings → Webhooks](https://dashboard.paystack.com/#/settings/webhooks)
2. Add webhook URL: `https://your-backend-api.vercel.app/api/payments/webhook`
3. Copy the **Webhook Secret**
4. Add it to Backend Environment Variables as `PAYSTACK_WEBHOOK_SECRET`
5. Redeploy backend

---

## Part 5: Testing Your Deployment

### 1. Test Backend API
Visit: `https://your-backend-api.vercel.app/api/health` (if you have a health endpoint)

Or test login endpoint:
```bash
curl -X POST https://your-backend-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Frontend
1. Visit your frontend URL: `https://your-app.vercel.app`
2. Try signing up / logging in
3. Browse properties
4. Make a test booking with Paystack test card: `4084084084084081`

### 3. Check for Common Issues

**CORS Errors:**
- Verify `FRONTEND_URL` in backend environment variables
- Check browser console for specific error messages

**API Connection Errors:**
- Verify `VITE_API_URL` in frontend environment variables
- Check Network tab in browser DevTools

**Payment Errors:**
- Verify you're using **LIVE** Paystack keys (not test keys)
- Check Paystack Dashboard for transaction logs

---

## Part 6: Custom Domain (Optional)

### Add Custom Domain to Frontend
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `myapp.com`)
3. Follow DNS configuration instructions

### Add Custom Domain to Backend
1. Vercel Dashboard → Backend Project → Settings → Domains
2. Add your API subdomain (e.g., `api.myapp.com`)
3. Update frontend `VITE_API_URL` to use new domain
4. Update backend `FRONTEND_URL` to match frontend domain

---

## Troubleshooting

### Build Failures

**Frontend Build Fails:**
```bash
# Run locally to check for errors
npm run build

# Check TypeScript errors
npm run lint
```

**Backend Build Fails:**
- Ensure all dependencies are in `package.json`, not just `devDependencies`
- Check Vercel build logs for specific errors

### Runtime Errors

**500 Internal Server Error:**
- Check Vercel backend logs: Dashboard → Your Backend → Deployments → Click deployment → View Function Logs
- Verify all environment variables are set correctly

**Database Connection Issues:**
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas logs

**Payment Issues:**
- Use Paystack test mode first with test keys
- Verify webhook URL is accessible
- Check Paystack Dashboard → Developers → Logs

---

## Continuous Deployment

Vercel automatically deploys when you push to your GitHub repository:

1. **Push to `main` branch** → Production deployment
2. **Push to other branches** → Preview deployment
3. **Pull Requests** → Automatic preview URLs

To disable auto-deployment:
- Vercel Dashboard → Settings → Git → Configure

---

## Environment Management

### Local Development (.env)
```bash
VITE_API_URL=http://localhost:5001
VITE_APP_URL=http://localhost:5173
```

### Production (Vercel Environment Variables)
```bash
VITE_API_URL=https://your-backend-api.vercel.app
VITE_APP_URL=https://your-app.vercel.app
```

**Note:** Paystack keys are only configured on the backend for security reasons.

---

## Security Checklist

- [ ] Use LIVE Paystack keys (not test keys) for production
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable MongoDB Atlas IP whitelist (0.0.0.0/0 for Vercel)
- [ ] Use environment variables for all secrets (never commit .env files)
- [ ] Enable HTTPS only (Vercel provides this by default)
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set up Paystack webhook with secret verification
- [ ] Use Gmail App Passwords (not your actual password)
- [ ] Regularly rotate secrets and API keys

---

## Cost Estimation

### Vercel (Free Tier)
- **Frontend**: Free (100GB bandwidth, unlimited requests)
- **Backend**: Free (100GB-hrs serverless execution, 100GB bandwidth)
- **Custom Domains**: Free

### MongoDB Atlas (Free Tier)
- **M0 Sandbox**: Free (512MB storage, shared RAM)

### Cloudinary (Free Tier)
- **Free**: 25 monthly credits (25GB storage, 25GB bandwidth)

### Paystack
- **Transaction Fee**: 1.5% + ₦100 (for Nigerian cards)
- **No monthly fees**

**Total Monthly Cost for Free Tiers**: ₦0 (until you exceed free limits)

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Paystack API**: https://paystack.com/docs/api
- **Cloudinary**: https://cloudinary.com/documentation

---

## Quick Reference Commands

```bash
# Deploy backend
cd backend && vercel --prod

# Deploy frontend
vercel --prod

# View logs (frontend)
vercel logs <deployment-url>

# View logs (backend)
cd backend && vercel logs <deployment-url>

# List deployments
vercel ls

# Remove deployment
vercel remove <deployment-name>
```

---

**Congratulations! Your application is now live on Vercel! 🎉**

For issues or questions, check the Vercel logs and Paystack dashboard for detailed error information.
