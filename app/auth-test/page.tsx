"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthTestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing connection...\n')
    try {
      // Test 1: Check client initialization
      setResult(prev => prev + '✓ Supabase client initialized\n')
      setResult(prev => prev + `URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)
      setResult(prev => prev + `Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...\n\n`)

      // Test 2: Check session
      setResult(prev => prev + 'Checking session...\n')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setResult(prev => prev + `❌ Session error: ${sessionError.message}\n`)
      } else {
        setResult(prev => prev + `✓ Session check OK (current session: ${sessionData.session ? 'logged in' : 'not logged in'})\n\n`)
      }

      // Test 3: Try to get user
      setResult(prev => prev + 'Getting user...\n')
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setResult(prev => prev + `❌ User error: ${userError.message}\n`)
      } else {
        setResult(prev => prev + `✓ User check OK (user: ${userData.user ? userData.user.email : 'none'})\n\n`)
      }

      // Test 4: Simple database query
      setResult(prev => prev + 'Testing database connection...\n')
      const { data: dbData, error: dbError } = await supabase.from('user_profiles').select('count').limit(1)
      if (dbError) {
        setResult(prev => prev + `❌ Database error: ${dbError.message}\n`)
        setResult(prev => prev + `Error details: ${JSON.stringify(dbError, null, 2)}\n`)
      } else {
        setResult(prev => prev + `✓ Database connection OK\n\n`)
      }

      setResult(prev => prev + '\n=== ALL TESTS COMPLETE ===\n')
    } catch (error: any) {
      setResult(prev => prev + `\n❌ CRITICAL ERROR: ${error.message}\n`)
      setResult(prev => prev + `Error type: ${error.name}\n`)
      setResult(prev => prev + `Stack: ${error.stack}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing login with test credentials...\n')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: 'test123456'
      })
      if (error) {
        setResult(prev => prev + `❌ Login failed: ${error.message}\n`)
        setResult(prev => prev + `Error status: ${error.status}\n`)
        setResult(prev => prev + `Full error: ${JSON.stringify(error, null, 2)}\n`)
      } else {
        setResult(prev => prev + `✓ Login successful!\n`)
        setResult(prev => prev + `User: ${data.user?.email}\n`)
      }
    } catch (error: any) {
      setResult(prev => prev + `\n❌ NETWORK ERROR: ${error.message}\n`)
      if (error.message.includes('Failed to fetch')) {
        setResult(prev => prev + '\n🔍 DIAGNOSIS: "Failed to fetch" typically means:\n')
        setResult(prev => prev + '1. CORS issue - Site URL not added to Supabase dashboard\n')
        setResult(prev => prev + '2. Network connectivity problem\n')
        setResult(prev => prev + '3. Supabase project is paused/inactive\n')
        setResult(prev => prev + '4. Browser blocking the request\n\n')
        setResult(prev => prev + '📋 ACTION ITEMS:\n')
        setResult(prev => prev + '1. Go to Supabase Dashboard > Settings > API\n')
        setResult(prev => prev + '2. Add http://localhost:3000 to "Site URL"\n')
        setResult(prev => prev + '3. Check Authentication > URL Configuration\n')
        setResult(prev => prev + '4. Verify project is not paused\n')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Supabase Auth Diagnostics</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm font-mono bg-gray-100 p-4 rounded">
            <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Missing'}</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Present' : '❌ Missing'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Run Tests</h2>
          <div className="flex gap-3">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Connection
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Login (test@test.com)
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-900 text-green-400 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Results</h2>
            <pre className="whitespace-pre-wrap font-mono text-sm">{result}</pre>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Common Solutions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Go to <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase Dashboard</a></li>
            <li>• Navigate to: Authentication → URL Configuration</li>
            <li>• Add <code className="bg-yellow-100 px-1 rounded">http://localhost:3000</code> to "Site URL"</li>
            <li>• Add <code className="bg-yellow-100 px-1 rounded">http://localhost:3000/**</code> to "Redirect URLs"</li>
            <li>• Make sure your project is not paused (Settings → General)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
