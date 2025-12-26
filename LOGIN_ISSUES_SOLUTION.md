# 🔐 Login Issues - Solution Guide

## Problem: "Invalid login credentials" Error

### Why This Happens

If you created your account using **Google** or **GitHub** sign-in, you don't have a password set in the system. You can only login using the same method you signed up with.

### Solution

**If you signed up with Google/GitHub:**
1. Click the **🔍 Google** or **💻 GitHub** button on the login modal
2. Do NOT use the email/password fields

**If you signed up with Email/Password:**
1. Make sure you're using the correct email address
2. Check that your password is correct (case-sensitive)
3. If you haven't confirmed your email, check your inbox

---

## How to Check Your Account Type

### Method 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to the **Console** tab
3. Try to login and look for error messages
4. The error will tell you if the credentials are invalid

### Method 2: Use Test Auth Page
1. Visit: `http://localhost:3000/test-auth`
2. This page shows your authentication status
3. If logged in, it shows your email and login method

---

## Common Issues & Solutions

### Issue 1: "Invalid email or password"
**Cause:** Wrong credentials OR you signed up with OAuth (Google/GitHub)

**Solution:**
- If you used Google/GitHub to sign up → Use those buttons to login
- If you used email/password → Check your credentials
- Password is case-sensitive
- Make sure email is correct

### Issue 2: "Email not confirmed"
**Cause:** You haven't clicked the confirmation link in your email

**Solution:**
1. Check your email inbox (and spam folder)
2. Look for email from Supabase
3. Click the confirmation link
4. Then try logging in again

### Issue 3: "User already registered"
**Cause:** Trying to sign up with an email that's already in use

**Solution:**
- Click "Login here" instead of signing up
- Use the same method you originally signed up with

### Issue 4: Can't remember how I signed up
**Solution:**
1. Try clicking the **Google** button
2. If that doesn't work, try the **GitHub** button
3. If neither works, you probably used email/password
4. Try the "Forgot Password" flow (not implemented yet)

---

## Understanding Login Methods

### OAuth (Google/GitHub) Users
- ✅ Can login with Google/GitHub buttons
- ❌ Cannot login with email/password (no password set)
- Your email is linked to your Google/GitHub account

### Email/Password Users
- ✅ Can login with email and password
- ❌ Cannot use Google/GitHub buttons (unless you link accounts)
- Must confirm email if enabled in Supabase

---

## Best Practices

### For OAuth Users (Google/GitHub)
1. Always use the same button you signed up with
2. Don't try to use email/password
3. Your session stays active across browser sessions

### For Email/Password Users
1. Use a strong password (at least 6 characters)
2. Confirm your email when you sign up
3. Remember which email you used

---

## Debugging Steps

If you're still having issues:

### Step 1: Check Connection
1. Visit `http://localhost:3000/test-auth`
2. Should show "✅ Supabase connection successful"
3. If not, check your `.env.local` file

### Step 2: Check Browser Console
1. Press F12
2. Look at the Console tab
3. Try to login
4. Look for error messages (they're detailed)

### Step 3: Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to Authentication → Users
3. Find your email in the list
4. Check which "Provider" is listed (email, google, github)
5. Use that method to login

### Step 4: Clear Browser Data
Sometimes cached data causes issues:
1. Press Ctrl+Shift+Delete
2. Clear cookies and site data for localhost
3. Refresh the page
4. Try logging in again

---

## Error Messages Explained

| Error Message | What It Means | Solution |
|--------------|---------------|----------|
| "Invalid login credentials" | Wrong email/password OR signed up with OAuth | Use OAuth buttons if you signed up with Google/GitHub |
| "Email not confirmed" | Haven't clicked confirmation link | Check your email inbox |
| "User already registered" | Email is already in use | Use login instead of signup |
| "Please enter a valid email address" | Email format is wrong | Include @ symbol |
| "Password must be at least 6 characters" | Password too short | Use 6+ characters |

---

## Quick Fix Commands

### If you want to reset everything:

```powershell
# Clear browser cache
# Open DevTools (F12) → Application → Clear Site Data

# Or restart the dev server
# Press Ctrl+C in terminal
npm run dev
```

---

## Contact Support

If none of these solutions work:

1. Check the browser console for detailed errors
2. Visit `/test-auth` to see connection status
3. Check your Supabase dashboard → Authentication → Logs
4. Look at the server terminal for error messages

---

## Important Notes

⚠️ **You cannot mix login methods**
- If you signed up with Google, you must login with Google
- If you signed up with GitHub, you must login with GitHub
- If you signed up with Email/Password, you must use Email/Password

✅ **Best Practice**
- Choose one method and stick with it
- OAuth (Google/GitHub) is easier (no password to remember)
- Email/Password gives you more control

---

## The Fix I Implemented

I've added several improvements to help with this issue:

1. ✅ **Better Error Messages** - Now tells you if you should use OAuth
2. ✅ **Info Box on Login** - Blue box reminds OAuth users to use buttons
3. ✅ **Detailed Console Logs** - Press F12 to see exact error
4. ✅ **Email Confirmation Check** - Warns if email isn't confirmed

Try logging in again now, and you should see much clearer guidance!
