"use client"
import React, { useState } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  open: boolean
  mode: 'login' | 'signup'
  onClose: () => void
}

export const AuthModal: React.FC<Props> = ({ open, mode: initialMode, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Reset form when mode changes
  React.useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  // Reset error when user types
  React.useEffect(() => {
    setError(null)
  }, [email, password, confirmPassword])

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    // Validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

  try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        console.log('Login success:', data)
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          window.location.href = '/profile'
        }, 1000)
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // Ensure user is redirected to profile after email confirm
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined
          }
        })
        if (error) throw error
        console.log('Signup success:', data)
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setSuccess('Account created! Please check your email to confirm your account.')
          setTimeout(() => {
            onClose()
          }, 3000)
        } else {
          setSuccess('Account created successfully! Redirecting...')
          setTimeout(() => {
            window.location.href = '/profile'
          }, 1000)
        }
      }
    } catch (e: any) {
      console.error('Auth error:', e)
      console.error('Full error details:', JSON.stringify(e, null, 2))
      
      // Network errors (CORS, no network) sometimes surface as "Failed to fetch".
      // Detect and provide actionable guidance.
      let errorMessage = 'Failed to authenticate. Please try again.'

      if (e?.message && typeof e.message === 'string' && e.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Network error while contacting Supabase. Common causes: incorrect Supabase URL/anon key, CORS/redirect not configured in the Supabase dashboard, or no network. Open /test-auth for diagnostics.'
      }
      
      if (e?.message?.includes('Invalid login credentials')) {
        if (mode === 'login') {
          errorMessage = 'Invalid email or password. If you signed up with Google/GitHub, please use those buttons to login.'
        } else {
          errorMessage = 'Invalid email or password. Please try again.'
        }
      } else if (e?.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please login instead.'
      } else if (e?.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before logging in.'
      } else if (e?.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (e?.message) {
        errorMessage = e.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const oauth = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: `${window.location.origin}/auth/callback`,
          // Let the library perform the redirect by default.
          skipBrowserRedirect: false
        }
      })
      if (error) throw error
      console.log('OAuth initiated:', data)
      setSuccess(`Redirecting to ${provider === 'google' ? 'Google' : 'GitHub'}...`)
      // The browser will redirect automatically
    } catch (e: any) {
      console.error('OAuth error:', e)
      // Provide a helpful message when provider isn't configured or network failed
      if (e?.message && e.message.toLowerCase().includes('failed to fetch')) {
        setError('Network error while initiating OAuth. Check your Supabase project URL/anon key and that redirect URLs are configured in the Supabase dashboard. See SUPABASE_SETUP.md')
      } else {
        setError(e?.message ?? `Failed to authenticate with ${provider === 'google' ? 'Google' : 'GitHub'}. Please check your browser's popup blocker and Supabase provider configuration.`)
      }
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      onSubmit()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === 'login' ? 'Welcome Back' : 'Create Your Account'}>
      <form onSubmit={onSubmit}>
        <div className="mb-4 flex gap-2">
          <Button 
            type="button"
            variant={mode === 'login' ? 'primary' : 'outline'} 
            onClick={() => {
              setMode('login')
              setError(null)
              setSuccess(null)
            }}
            className="flex-1"
          >
            Login
          </Button>
          <Button 
            type="button"
            variant={mode === 'signup' ? 'primary' : 'outline'} 
            onClick={() => {
              setMode('signup')
              setError(null)
              setSuccess(null)
            }}
            className="flex-1"
          >
            Sign up
          </Button>
        </div>
        <div className="space-y-3">
          <Input 
            type="email" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            onKeyPress={handleKeyPress}
            label="Email Address" 
            disabled={loading}
            autoComplete="email"
            required
          />
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            onKeyPress={handleKeyPress}
            label="Password" 
            disabled={loading}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
          {mode === 'signup' && (
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              onKeyPress={handleKeyPress}
              label="Confirm Password" 
              disabled={loading}
              autoComplete="new-password"
              required
            />
          )}
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <p className="text-sm text-green-800">✅ {success}</p>
            </div>
          )}
          <Button 
            type="submit"
            onClick={onSubmit} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                {mode === 'login' ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Login' : 'Create Account'
            )}
          </Button>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => oauth('google')}
              disabled={loading}
              className="relative"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </span>
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => oauth('github')}
              disabled={loading}
              className="relative"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                GitHub
              </span>
            </Button>
          </div>
          
          {mode === 'login' && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs text-blue-800">
                💡 <strong>Note:</strong> If you signed up with Google or GitHub, please use those buttons above to login.
              </p>
            </div>
          )}
          {mode === 'login' && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setMode('signup')} 
                className="text-primary font-medium hover:underline"
                disabled={loading}
              >
                Sign up here
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')} 
                className="text-primary font-medium hover:underline"
                disabled={loading}
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  )
}
