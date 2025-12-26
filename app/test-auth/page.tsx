"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestAuthPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if client is configured
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!url || !key) {
          setStatus('❌ Environment variables not set')
          setDetails({ url: !!url, key: !!key })
          return
        }

        // Test 2: Try to get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setStatus('❌ Failed to connect to Supabase')
          setDetails({ error: sessionError.message })
          return
        }

        // Test 3: Try a simple query (will fail if RLS not set, but connection works)
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
        
        setStatus('✅ Supabase connection successful!')
        setDetails({
          connected: true,
          session: !!session,
          user: session?.user?.email,
          queryTest: error ? `Expected: ${error.message}` : 'Table accessible'
        })
      } catch (e: any) {
        setStatus('❌ Connection failed')
        setDetails({ error: e.message })
      }
    }

    testConnection()
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Status</h2>
        <p className="text-lg mb-4">{status}</p>
        
        {details && (
          <div className="mt-4 rounded bg-gray-100 p-4">
            <h3 className="font-medium mb-2">Details:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify(details, null, 2)}</pre>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Environment Check:</h3>
          <ul className="space-y-1 text-sm">
            <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>

        <div className="mt-6">
          <a href="/" className="btn">Back to Home</a>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="text-xl font-semibold mb-3">Quick Setup Checklist</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Environment variables in <code className="bg-gray-100 px-1 rounded">.env.local</code> ✓</li>
          <li>Email auth enabled in Supabase dashboard</li>
          <li>Redirect URLs configured. Expected example: <code className="bg-gray-100 px-1 rounded">{typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3001/auth/callback'}</code></li>
          <li>SQL schema run in Supabase SQL Editor</li>
          <li>OAuth providers configured (if using Google/GitHub)</li>
        </ol>
        <p className="mt-4 text-sm text-gray-600">
          See <code className="bg-gray-100 px-1 rounded">SUPABASE_SETUP.md</code> for detailed instructions.
        </p>
      </div>
    </main>
  )
}
