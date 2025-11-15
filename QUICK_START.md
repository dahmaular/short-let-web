# Quick Start Guide - Vercel Deployment

## 🚀 Deploy in 5 Minutes

### Prerequisites Checklist
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] MongoDB Atlas database URL
- [ ] Paystack API keys (test or live)

---

## Backend Deployment (3 minutes)

### 1. Deploy Backend
```bash
cd backend
vercel
```

### 2. Add Environment Variables
Go to Vercel Dashboard → Backend Project → Settings → Environment Variables

**Copy-paste these (replace values):**
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_random_32_char_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Get Backend URL
Copy your backend URL from Vercel (e.g., `https://short-let-api.vercel.app`)

---

## Frontend Deployment (2 minutes)

### 1. Deploy Frontend
```bash
cd ..  # Go to root directory
vercel
```

### 2. Add Environment Variables
Go to Vercel Dashboard → Frontend Project → Settings → Environment Variables

```
VITE_API_URL=https://your-backend-api.vercel.app
VITE_APP_URL=https://your-frontend.vercel.app
```

**Note:** No Paystack keys needed on frontend - handled by backend.

### 3. Update Backend FRONTEND_URL
Go back to Backend Project → Settings → Environment Variables
- Update `FRONTEND_URL` with your actual frontend URL
- Redeploy backend

---

## ✅ Test Your Deployment

1. Visit your frontend URL
2. Sign up / Log in
3. Browse properties
4. Make a test booking

---

## 🆘 Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in backend environment variables
- Verify it matches your frontend URL exactly (no trailing slash)

### API Connection Failed
- Check `VITE_API_URL` in frontend environment variables
- Test backend: `curl https://your-backend-api.vercel.app/api/health`

### Payment Issues
- Verify you're using LIVE Paystack keys for production
- Check Paystack Dashboard → Developers → API Keys

---

## 📝 Important Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Paystack Dashboard**: https://dashboard.paystack.com
- **Full Guide**: See DEPLOYMENT.md

---

## 🔐 Security Reminders

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Use LIVE Paystack keys (not test keys) for production
- [ ] Never commit .env files to GitHub
- [ ] Add .env to .gitignore

---

**Need help?** Check DEPLOYMENT.md for detailed instructions.
