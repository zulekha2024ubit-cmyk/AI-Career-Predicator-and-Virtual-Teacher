"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (session) {
          console.log('Auth successful, redirecting to profile')
          // Successful authentication, redirect to profile
          router.push('/profile')
        } else {
          console.log('No session found, redirecting to home')
          router.push('/')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner message="Completing authentication..." />
        <p className="mt-4 text-gray-600">Please wait while we log you in...</p>
      </div>
    </div>
  )
}
