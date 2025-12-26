# Supabase Setup Guide

## Critical Setup Steps

### 1. Enable Email Authentication
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `tuzgdaxuzqrdbxflxeyh`
3. Go to **Authentication** → **Providers**
4. Make sure **Email** is enabled
5. **Confirm email** should be set based on your preference (disable for testing)

### 2. Add Redirect URLs for OAuth
1. In **Authentication** → **URL Configuration**
2. Add these Site URLs:
   - `http://localhost:3000`
   - `http://localhost:3000/profile`
   
3. Add these Redirect URLs:
   - `http://localhost:3000/**`
   - `http://localhost:3000/profile`
   - (Add your production domain later)

### 3. Configure OAuth Providers

#### For Google OAuth:
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. You need Google Cloud Console credentials:
   - Go to https://console.cloud.google.com
   - Create/select a project
   - Enable Google+ API
   - Go to **Credentials** → Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://tuzgdaxuzqrdbxflxeyh.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

#### For GitHub OAuth:
1. Go to **Authentication** → **Providers**
2. Enable **GitHub**
3. Create a GitHub OAuth App:
   - Go to https://github.com/settings/developers
   - Click **New OAuth App**
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `https://tuzgdaxuzqrdbxflxeyh.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### 4. Run the SQL Schema
1. Go to **SQL Editor** in Supabase
2. Copy the entire SQL block from `README.md` (lines 26-94)
3. Click **Run** to create tables, policies, and seed data

### 5. Test the Setup
After completing the above:
1. Restart your dev server: `npm run dev`
2. Open http://localhost:3000
3. Try to sign up with email/password
4. Check browser console (F12) for any error messages
5. Try Google/GitHub login (should redirect properly)

## Troubleshooting

### "Failed to fetch" error
- Check if email provider is enabled in Supabase
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in `.env.local`
- Check browser console for CORS errors
- Make sure `http://localhost:3000` is in Redirect URLs

### OAuth not working
- Verify OAuth provider is enabled in Supabase
- Check if callback URL is correct: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- Make sure Client ID and Secret are correctly entered
- Check if redirect URL matches what you configured

### Email confirmation issues
- For development, you can disable email confirmation in Auth settings
- Or check your email for confirmation link
- Check Supabase logs in **Logs** → **Auth**

## Quick Test Commands
```powershell
# Restart dev server
npm run dev

# Check if env vars are loaded (in browser console)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## Next Steps
Once auth works:
1. Create a test account
2. Fill the profile at `/profile`
3. Test the career predictor at `/predictor`
4. Check the learning journey at `/learn/full-stack-web-development?step=0`

