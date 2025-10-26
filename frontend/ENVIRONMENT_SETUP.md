# Environment Setup Guide

This guide explains how to configure the environment variables for the Udyam Union frontend application.

## Environment Files

The application supports multiple environment configurations:

- `.env` - Main environment file (used by Vite)
- `.env.development` - Development environment
- `.env.production` - Production environment

## Available Environments

### Development
- **API URL**: `http://localhost:5000/api`
- **Mock Mode**: `true`
- **Use Case**: Local development with backend running locally

### Production
- **API URL**: `https://udyam-union-backend.herokuapp.com/api`
- **Mock Mode**: `false`
- **Use Case**: Production deployment

### Mock
- **API URL**: `http://localhost:5000/api`
- **Mock Mode**: `true`
- **Use Case**: Development without backend

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://udyam-union-backend.herokuapp.com/api` |
| `VITE_APP_NAME` | Application name | `Udyam Union` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_MOCK_MODE` | Enable mock API fallback | `true` or `false` |

## Quick Setup

### Using the Environment Switcher

```bash
# Switch to development environment
node switch-env.js switch development

# Switch to production environment
node switch-env.js switch production

# Switch to mock environment
node switch-env.js switch mock

# Show current environment
node switch-env.js show

# List available environments
node switch-env.js list
```

### Manual Setup

1. Copy the appropriate environment file:
   ```bash
   # For development
   cp .env.development .env
   
   # For production
   cp .env.production .env
   ```

2. Edit the `.env` file to match your setup:
   ```bash
   VITE_API_URL=https://your-backend-url.herokuapp.com/api
   VITE_APP_NAME=Udyam Union
   VITE_APP_VERSION=1.0.0
   VITE_MOCK_MODE=false
   ```

## Troubleshooting

### CORS Errors
If you're getting CORS errors, make sure:
1. Your backend is running and accessible
2. CORS is properly configured on your backend
3. The API URL is correct

### Network Errors
If you're getting network errors:
1. Check if the backend is running
2. Verify the API URL is correct
3. Enable mock mode for development: `VITE_MOCK_MODE=true`

### Mock API Fallback
The application automatically falls back to mock API when:
- Backend is not available
- Network errors occur
- CORS errors are encountered

This ensures the application works even without a backend for development and testing.

## Development Workflow

1. **Start with mock mode**: Use `VITE_MOCK_MODE=true` for initial development
2. **Connect to backend**: Set up your backend and update `VITE_API_URL`
3. **Test with real API**: Set `VITE_MOCK_MODE=false` to use real backend
4. **Deploy**: Use production environment for deployment

## Backend Setup

Make sure your backend is configured with proper CORS settings:

```javascript
// Example CORS configuration for Express.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://udyam-b8dbd.web.app'],
  credentials: true
}));
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify environment variables are loaded correctly
3. Ensure the backend is running and accessible
4. Check CORS configuration on your backend
