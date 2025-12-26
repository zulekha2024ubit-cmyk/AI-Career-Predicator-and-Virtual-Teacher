# 🔧 Quick Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "Failed to fetch" or Connection Error

**Symptoms:**
- Login/signup doesn't work
- Can't connect to Supabase

**Solutions:**
1. Check if `.env.local` file exists in the root directory
2. Verify environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tuzgdaxuzqrdbxflxeyh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```
3. Restart the dev server: `npm run dev`
4. Visit `/test-auth` to verify connection
5. Check Supabase dashboard is accessible

---

### Issue 2: Email Confirmation Not Working

**Symptoms:**
- Account created but can't login
- Waiting for confirmation email

**Solutions:**
1. **For Development**: Disable email confirmation
   - Go to Supabase Dashboard → Authentication → Settings
   - Disable "Confirm email" option
   
2. **For Production**: Check email settings
   - Verify email provider is configured
   - Check spam folder
   - Check Supabase Auth logs

---

### Issue 3: OAuth (Google/GitHub) Not Working

**Symptoms:**
- Google/GitHub button doesn't work
- Redirect error

**Solutions:**
1. **Setup Required**: OAuth needs additional configuration
   - See `SUPABASE_SETUP.md` for detailed steps
   - Need to create OAuth apps in Google/GitHub
   - Add credentials to Supabase Dashboard

2. **Redirect URL**: Must be correct
   - Development: `https://tuzgdaxuzqrdbxflxeyh.supabase.co/auth/v1/callback`
   - Add `http://localhost:3000` to allowed URLs

---

### Issue 4: Profile Not Saving

**Symptoms:**
- Click "Save Profile" but nothing happens
- Error message appears

**Solutions:**
1. Check required fields are filled:
   - Full Name
   - Email (auto-filled)
   - Current Level
   - Field of Study
   - Career Interests

2. Check browser console (F12) for errors

3. Verify Supabase table exists:
   ```sql
   SELECT * FROM user_profiles LIMIT 1;
   ```

4. Check RLS policies are set up (see `README.md`)

---

### Issue 5: Learning Materials Not Loading

**Symptoms:**
- Learning page shows "No items yet"

**Solutions:**
1. **Expected Behavior**: Materials come from database
2. Add sample materials:
   ```sql
   INSERT INTO materials (career_slug, step_id, category, title, url) VALUES
   ('full-stack-web-development', 'html-css', 'book', 'Sample Book', 'https://example.com');
   ```
3. See `README.md` for complete seed data SQL

---

### Issue 6: Virtual Teacher Not Responding

**Symptoms:**
- Chat shows placeholder responses

**Solutions:**
1. **Expected Behavior**: AI integration not implemented yet
2. **To Enable**:
   - Add OpenAI API key to `.env.local`
   - Implement API call in `FloatingChatWidget.tsx`
   - See component file for TODO comments

---

### Issue 7: Page Stuck Loading

**Symptoms:**
- Loading spinner never disappears
- Page doesn't load

**Solutions:**
1. Check browser console for errors
2. Verify authentication status: `/test-auth`
3. Clear browser cache and cookies
4. Restart dev server
5. Check network tab for failed requests

---

### Issue 8: TypeScript Errors

**Symptoms:**
- Red underlines in code
- Build fails

**Solutions:**
1. Run type check: `npm run typecheck`
2. Install dependencies: `npm install`
3. Restart VS Code TypeScript server
4. Check `tsconfig.json` is present

---

### Issue 9: Styling Not Working

**Symptoms:**
- Page looks unstyled
- CSS not loading

**Solutions:**
1. Verify Tailwind CSS is installed: `npm list tailwindcss`
2. Check `tailwind.config.ts` exists
3. Verify `globals.css` imports Tailwind directives
4. Restart dev server
5. Clear `.next` folder: `Remove-Item -Recurse -Force .next`

---

### Issue 10: Database Permission Denied

**Symptoms:**
- "new row violates row-level security policy"
- Can't read/write data

**Solutions:**
1. Run RLS policy setup SQL (see `README.md` lines 26-94)
2. Verify policies in Supabase Dashboard → Database → Policies
3. Check user is authenticated before accessing data
4. Ensure table has RLS enabled

---

## Quick Diagnostic Commands

```powershell
# Check if project dependencies are installed
npm list

# Verify environment variables are loaded
# (Run in browser console on any page)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

# Check for TypeScript errors
npm run typecheck

# Rebuild the project
npm run build

# Clear Next.js cache
Remove-Item -Recurse -Force .next; npm run dev
```

---

## Debug Pages

- `/test-auth` - Test authentication connection
- Browser Console (F12) - View detailed error logs
- Network Tab (F12) - Monitor API requests
- Supabase Dashboard → Logs - View backend logs

---

## When All Else Fails

1. **Check Prerequisites**:
   - Node.js installed (v18+)
   - npm installed
   - `.env.local` exists with valid credentials
   - Supabase project is accessible

2. **Fresh Start**:
   ```powershell
   # Remove node modules and reinstall
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   
   # Clear Next.js cache
   Remove-Item -Recurse -Force .next
   
   # Restart dev server
   npm run dev
   ```

3. **Verify Database**:
   - Tables exist: `user_profiles`, `materials`
   - RLS policies are set up
   - Sample data exists (optional)

4. **Check Supabase**:
   - Project is not paused
   - Email auth is enabled
   - Redirect URLs are configured
   - API keys are correct

---

## Getting Help

If issues persist:

1. **Check Browser Console**: Press F12 and look for red error messages
2. **Check Network Tab**: See which API calls are failing
3. **Check Supabase Logs**: Dashboard → Logs → Auth/Database
4. **Review Setup Docs**: `SUPABASE_SETUP.md` and `README.md`

---

**Most issues are solved by:**
- ✅ Restarting the dev server
- ✅ Checking environment variables
- ✅ Verifying Supabase connection at `/test-auth`
- ✅ Reviewing browser console errors
