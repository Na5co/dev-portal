# 🚀 Deployment Guide - Closed Beta

This guide will help you deploy your Postman Documentation Generator for your closed beta.

## Quick Deploy with Vercel (Recommended)

Vercel is the easiest option since it's made by the Next.js team.

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit - Postman Docs Generator v1.0"
   
   # Create new repo on GitHub, then:
   git remote add origin https://github.com/yourusername/postman-docs-generator.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure everything
   - Click "Deploy" 
   - **Done!** You'll get a URL like: `https://postman-docs-generator-yourusername.vercel.app`

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# In your project directory
cd /Users/atanas.ameti@postman.com/Desktop/dvprtl/dev-portal/postman-docs-generator

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name? postman-docs-generator
# - Deploy? Yes
```

## Alternative: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect your GitHub repo

## Environment Variables

Your app doesn't currently use environment variables, so no additional setup needed!

## Custom Domain (Optional)

Both Vercel and Netlify allow custom domains:
- **Vercel**: Project Settings → Domains → Add Domain
- **Netlify**: Site Settings → Domain Management → Add Domain

## Access Control for Closed Beta

### Option 1: Simple Password Protection
Add a simple password page:

```typescript
// Create: src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')
    
    if (user === 'beta' && pwd === 'your-secret-password') {
      return NextResponse.next()
    }
  }
  
  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
```

### Option 2: Vercel Password Protection
- In Vercel dashboard → Project Settings → Environment Variables
- Add: `VERCEL_PASSWORD=your-secret-password`
- Redeploy

### Option 3: IP Whitelist (Vercel Pro)
- Restrict access to specific IP addresses
- Good for small team beta

## Beta Testing URLs

Once deployed, you'll have:

- **Main App**: `https://your-app.vercel.app`
- **Deployed Docs**: `https://your-app.vercel.app/deployed/[collection-id]`

## Share with Beta Testers

Send them:
1. **Main URL** to create documentation
2. **Instructions** on how to upload Postman collections
3. **Password** (if using protection)

## Monitoring & Analytics

### Add Simple Analytics (Optional)
```bash
npm install @vercel/analytics
```

```typescript
// Add to src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Production Checklist

- [ ] Test build locally: `npm run build && npm start`
- [ ] Remove console.logs
- [ ] Add error boundaries
- [ ] Set up password protection
- [ ] Test all features on deployed version
- [ ] Share with beta testers

## Troubleshooting

### Build Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build
```

### Deployment Issues
- Check Vercel/Netlify build logs
- Ensure all dependencies are in `package.json`
- Verify Next.js version compatibility

---

**🎉 Your app is ready for deployment!** 

Choose Vercel for the easiest setup, and you'll have your closed beta running in minutes.
