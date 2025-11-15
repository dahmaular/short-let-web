# Pre-Deployment Checklist

## ✅ Before Deploying

### 1. Code Readiness
- [x] All API URLs updated to use config
- [x] Environment variables configured
- [x] CORS settings updated
- [x] Gitignore includes .env files
- [ ] All tests passing (if you have tests)
- [ ] No console errors in development

### 2. Required Accounts & Services
- [ ] Vercel account created
- [ ] MongoDB Atlas database created
- [ ] Paystack account created (with live keys)
- [ ] Cloudinary account created
- [ ] Email service configured (Gmail app password)
- [ ] GitHub repository ready

### 3. Credentials Ready
- [ ] MongoDB URI (from MongoDB Atlas)
- [ ] JWT Secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Cloudinary credentials (cloud name, API key, API secret)
- [ ] Email credentials (SMTP host, port, user, password)
- [ ] Paystack LIVE keys (secret and public)

### 4. MongoDB Atlas Setup
- [ ] Database created
- [ ] Database user created with password
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] Connection string tested locally

### 5. Paystack Setup
- [ ] Account verified
- [ ] Live API keys obtained (sk_live_xxx and pk_live_xxx)
- [ ] Business information completed
- [ ] Bank account added for settlements

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend First
```bash
cd backend
vercel
```
- [ ] Backend deployed successfully
- [ ] Backend URL noted: _______________________________
- [ ] All environment variables added to Vercel
- [ ] Backend redeployed after adding env vars

### Step 2: Deploy Frontend
```bash
cd ..
vercel
```
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: _______________________________
- [ ] Frontend environment variables added (including backend URL)
- [ ] Frontend redeployed after adding env vars

### Step 3: Update Backend with Frontend URL
- [ ] Updated FRONTEND_URL in backend environment variables
- [ ] Backend redeployed with correct FRONTEND_URL

### Step 4: Configure Paystack Webhook
- [ ] Webhook URL added: `https://your-backend-api.vercel.app/api/payments/webhook`
- [ ] Webhook secret obtained
- [ ] Webhook secret added to backend environment variables

---

## 🧪 Post-Deployment Testing

### Frontend Tests
- [ ] Frontend URL loads
- [ ] Homepage displays correctly
- [ ] Navigation works
- [ ] Images load properly
- [ ] Responsive design works on mobile

### Authentication Tests
- [ ] Can access signup page
- [ ] Can create new account
- [ ] Receive welcome email (if configured)
- [ ] Can log in with created account
- [ ] Can log out
- [ ] Protected routes work (dashboard)

### Property Browsing Tests
- [ ] Can view property listings
- [ ] Can filter properties
- [ ] Can search properties
- [ ] Property detail page loads
- [ ] Images gallery works
- [ ] Similar properties show

### Booking Flow Tests
- [ ] Can select dates
- [ ] Date validation works
- [ ] Can enter guest details
- [ ] Pricing calculates correctly
- [ ] Can proceed to payment
- [ ] Paystack modal opens
- [ ] Test payment works (use test card: 4084084084084081)
- [ ] Redirects to confirmation page
- [ ] Booking appears in dashboard

### Dashboard Tests
- [ ] Can view bookings
- [ ] Active bookings show correctly
- [ ] Past bookings show correctly
- [ ] Can cancel booking
- [ ] Profile update works
- [ ] Favorites work (if implemented)

### Payment Tests
- [ ] Paystack integration works
- [ ] Payment verification succeeds
- [ ] Booking status updates after payment
- [ ] Transaction appears in Paystack dashboard

### API Tests
- [ ] No CORS errors in console
- [ ] API calls succeed (check Network tab)
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Authentication persists on refresh

---

## 🔍 Common Issues to Check

### CORS Errors
If you see CORS errors:
- [ ] Verify FRONTEND_URL in backend matches actual frontend URL
- [ ] Check for trailing slashes (should match exactly)
- [ ] Ensure backend has been redeployed after updating FRONTEND_URL

### API Connection Errors
If API calls fail:
- [ ] Verify VITE_API_URL in frontend environment variables
- [ ] Test backend directly: `curl https://your-backend-api.vercel.app/api/health`
- [ ] Check Vercel function logs for backend errors
- [ ] Ensure all backend environment variables are set

### Database Connection Errors
If MongoDB connection fails:
- [ ] Verify MONGODB_URI is correct
- [ ] Check MongoDB Atlas allows 0.0.0.0/0 in Network Access
- [ ] Verify database user has correct permissions
- [ ] Check MongoDB Atlas logs for connection attempts

### Payment Errors
If payments fail:
- [ ] Verify using LIVE Paystack keys (not test keys)
- [ ] Check Paystack dashboard for transaction logs
- [ ] Verify PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY match
- [ ] Test with Paystack test card first: 4084084084084081

### Email Errors
If emails not sending:
- [ ] Verify email credentials are correct
- [ ] For Gmail, use App Password (not regular password)
- [ ] Check email service allows less secure apps
- [ ] Verify EMAIL_HOST and EMAIL_PORT are correct

---

## 📊 Monitoring

### After Launch
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Monitor Vercel function logs
- [ ] Check MongoDB Atlas metrics
- [ ] Review Paystack transaction reports
- [ ] Monitor email delivery rates

### Regular Checks
- [ ] Check Vercel bandwidth usage
- [ ] Monitor MongoDB storage usage
- [ ] Review Paystack settlements
- [ ] Check Cloudinary usage
- [ ] Review application errors

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Using LIVE Paystack keys (not test keys) for production
- [ ] .env files are in .gitignore
- [ ] No secrets committed to GitHub
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS configured properly
- [ ] Database uses strong password
- [ ] Email uses app password (not main password)

---

## 📝 Documentation

- [ ] DEPLOYMENT.md reviewed
- [ ] QUICK_START.md reviewed
- [ ] Environment variables documented
- [ ] Team members have access to:
  - Vercel dashboard
  - MongoDB Atlas
  - Paystack dashboard
  - GitHub repository

---

## 🎉 Launch Checklist

Final steps before announcing:
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Mobile experience tested
- [ ] Error handling works
- [ ] Loading states implemented
- [ ] Success messages display
- [ ] Terms of service added (if required)
- [ ] Privacy policy added (if required)
- [ ] Contact information added

---

## 📞 Support Information

If you encounter issues:
1. Check Vercel function logs
2. Review browser console for errors
3. Check Network tab for failed requests
4. Review service-specific dashboards (MongoDB, Paystack, etc.)
5. Consult DEPLOYMENT.md troubleshooting section

---

**Ready to Deploy?** Start with QUICK_START.md for fastest deployment!

---

## Notes Section

Use this space for your specific deployment notes:

**Backend URL**: _______________________________________________

**Frontend URL**: _______________________________________________

**Deployment Date**: _______________________________________________

**Deployed By**: _______________________________________________

**Issues Encountered**: 
_______________________________________________
_______________________________________________
_______________________________________________

**Resolutions**:
_______________________________________________
_______________________________________________
_______________________________________________
