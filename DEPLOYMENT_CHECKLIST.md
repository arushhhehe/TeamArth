# 🚀 Deployment Checklist

## Pre-Deployment Setup

### 1. Firebase Setup
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login to Firebase: `firebase login`
- [ ] Create Firebase project in console
- [ ] Update .firebaserc with your project ID
- [ ] Configure firebase.json

### 2. Backend Deployment (Choose One)

#### Option A: Heroku
- [ ] Install Heroku CLI
- [ ] Create Heroku app: `heroku create udyam-union-backend`
- [ ] Set environment variables
- [ ] Deploy: `git push heroku main`

#### Option B: Railway
- [ ] Connect GitHub repository
- [ ] Set environment variables in dashboard
- [ ] Deploy automatically

#### Option C: Vercel
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Deploy: `vercel --prod`

### 3. Database Setup
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Get connection string
- [ ] Update backend environment variables

### 4. Environment Configuration
- [ ] Update frontend/.env with backend URL
- [ ] Update backend/.env with MongoDB URI
- [ ] Set secure JWT secret
- [ ] Configure admin credentials

## Deployment Steps

### 1. Build Frontend
```bash
npm run build
```

### 2. Deploy Backend
```bash
cd backend
# Follow Heroku/Railway/Vercel deployment steps
```

### 3. Deploy Frontend
```bash
firebase deploy --only hosting
```

### 4. Test Deployment
- [ ] Visit Firebase hosting URL
- [ ] Test onboarding flow
- [ ] Test admin panel
- [ ] Verify file uploads
- [ ] Check mobile responsiveness

## Post-Deployment

### 1. Domain Setup (Optional)
- [ ] Add custom domain in Firebase console
- [ ] Configure DNS records
- [ ] Update backend CORS settings

### 2. SSL Certificate
- [ ] Firebase provides automatic SSL
- [ ] Verify HTTPS is working

### 3. Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Monitor performance

## Troubleshooting

### Common Issues
1. **CORS errors**: Update backend CORS settings
2. **Build fails**: Check Node.js version
3. **Database connection**: Verify MongoDB URI
4. **File uploads**: Check file size limits

### Debug Commands
```bash
# Check Firebase project
firebase projects:list

# Test local build
npm run build
firebase serve

# Check backend logs
heroku logs --tail
```

## URLs After Deployment

- **Frontend**: https://your-firebase-app.web.app
- **Backend API**: https://your-backend-url.herokuapp.com/api
- **Admin Panel**: https://your-firebase-app.web.app/admin

## Support

For deployment issues:
- Check Firebase documentation
- Review Heroku/Railway logs
- Test locally first
- Verify environment variables
