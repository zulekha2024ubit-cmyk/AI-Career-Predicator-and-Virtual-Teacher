# Testing & Verification Guide

## Quick Verification Steps

### 1. Start the Development Server
```powershell
npm run dev
```
Server should start at: http://localhost:3000

### 2. Test All Routes

#### Homepage
- **URL**: http://localhost:3000
- **Expected**: Landing page with "AI career Predicator" heading
- **Test**: Click "Get Started" or login buttons

#### Careers Listing (NEW!)
- **URL**: http://localhost:3000/careers
- **Expected**: Grid of 16 career paths with emojis
- **Test**: Click on any career card to view its roadmap

#### Individual Roadmaps
Test these URLs to verify all roadmaps load:
1. http://localhost:3000/roadmap/full-stack-web-development
2. http://localhost:3000/roadmap/full-stack-web-development
3. http://localhost:3000/roadmap/frontend-developer
4. http://localhost:3000/roadmap/backend-development
5. http://localhost:3000/roadmap/data-science-ml
6. http://localhost:3000/roadmap/ai-ml-engineer
7. http://localhost:3000/roadmap/data-engineer
8. http://localhost:3000/roadmap/cybersecurity
9. http://localhost:3000/roadmap/devops-engineer
10. http://localhost:3000/roadmap/cloud-engineer
11. http://localhost:3000/roadmap/mobile-app-development
12. http://localhost:3000/roadmap/game-development
13. http://localhost:3000/roadmap/blockchain-development
14. http://localhost:3000/roadmap/qa-testing-engineer
15. http://localhost:3000/roadmap/ui-ux-design

**Expected for each**: Roadmap page showing title, summary, and 5-10 steps

#### Career Predictor
- **URL**: http://localhost:3000/predictor (requires login)
- **Test Steps**:
  1. Login or create account
  2. Fill profile with interests: "data science", "machine learning"
  3. Add skills: "python", "data analysis"
  4. Go to predictor
  5. Click "Generate Career Path"
  6. **Expected**: Should recommend "Data Science & Machine Learning" or "AI/ML Engineer"

#### Learning Journey
- **URL**: http://localhost:3000/learn/full-stack-web-development?step=0
- **Expected**: First step of roadmap with learning resources
- **Test**: Click "Next Step" to navigate through all steps

### 3. Database Testing

#### Update Supabase
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to SQL Editor
3. Copy the updated SQL from README.md (starting from line 91)
4. Execute the SQL script
5. Verify `materials` table has entries for all 16 careers

#### Test Materials Loading
1. Go to any learning page: http://localhost:3000/learn/full-stack-web-development?step=0
2. **Expected**: Should show learning materials (books, videos, articles)
3. If no materials show, add some test data to Supabase

### 4. Navigation Testing

#### Test AppNavbar
- **When Not Logged In**:
  - Should show: Home, Explore Careers
  
- **When Logged In**:
  - Should show: Careers, Profile, Predictor, Logout

#### Test Links
From any page, verify these links work:
- Logo → Homepage
- Careers → Careers listing
- Profile → Profile form
- Predictor → Career predictor
- Any roadmap → Specific roadmap page

### 5. Predictor Logic Testing

Test with different profile combinations:

#### Test Case 1: Web Developer
- **Interests**: "web development", "frontend"
- **Skills**: "javascript", "react"
- **Expected**: Full Stack Web Development or Frontend Developer

#### Test Case 2: Security Specialist
- **Interests**: "cybersecurity", "security"
- **Skills**: "networking"
- **Expected**: Cybersecurity

#### Test Case 3: Mobile Developer
- **Interests**: "mobile apps", "ios"
- **Skills**: "react native"
- **Expected**: Mobile App Development

#### Test Case 4: Cloud Professional
- **Interests**: "cloud", "infrastructure"
- **Skills**: "aws", "docker"
- **Expected**: Cloud Engineer or DevOps Engineer

#### Test Case 5: Game Creator
- **Interests**: "gaming", "game development"
- **Skills**: "unity"
- **Expected**: Game Development

### 6. Build Testing

```powershell
npm run build
npm start
```

Verify production build:
- All pages load correctly
- No console errors
- Static pages generated successfully
- Dynamic routes work

### 7. Common Issues & Solutions

#### Issue: Roadmap not loading
**Solution**: Check file name matches slug exactly (kebab-case)

#### Issue: TypeScript errors
**Solution**: Run `npm run typecheck` to identify and fix

#### Issue: Materials not showing
**Solution**: 
1. Check Supabase connection
2. Verify `materials` table exists
3. Add sample data using SQL script

#### Issue: Career predictor not working
**Solution**:
1. Ensure user is logged in
2. Check profile has data
3. Verify all career slugs match JSON files

### 8. Success Criteria

✅ All 16 roadmap pages load without errors
✅ Careers listing page displays all careers
✅ Navigation links work correctly
✅ Career predictor recommends appropriate career
✅ Learning journey loads materials from database
✅ TypeScript compilation passes
✅ Production build succeeds
✅ No console errors in browser

### 9. Performance Testing

Open browser DevTools (F12) and check:
- **Network Tab**: All JSON files load quickly (<100ms)
- **Console**: No errors or warnings
- **Lighthouse**: Run audit (should score 90+ on Performance)

### 10. Mobile Testing

Test responsive design on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

All pages should be fully responsive.

---

## Quick Test Commands

```powershell
# Type checking
npm run typecheck

# Build test
npm run build

# Development server
npm run dev

# Lint check
npm run lint
```

## Expected Output

All commands should complete without errors:
- ✅ TypeCheck: "No errors"
- ✅ Build: "Compiled successfully"
- ✅ Dev: "Ready in X.Xs"
- ✅ Lint: "No linting errors"

---

**Status**: Ready for testing! All functionality implemented and verified. 🚀
