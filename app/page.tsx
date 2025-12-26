"use client"
import React, { useEffect, useState } from 'react'
import { AuthModal } from '@/components/AuthModal'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function LandingPage() {
  const [openAuth, setOpenAuth] = useState<null | 'login' | 'signup'>(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [hasUser, setHasUser] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
        setHasUser(!!data.user)
        setUserLoaded(true)
    })
    return () => { mounted = false }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setHasUser(false)
  }

  return (
    <main className="relative min-h-screen bg-kaggle-light">
      {/* Conditional navbar with Kaggle styling */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-kaggle-blue rounded flex items-center justify-center transform group-hover:bg-[#1BA8E0] transition-all duration-200">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-2xl font-bold text-kaggle-navy">
              CareerPath
            </span>
          </Link>
          <div className="flex items-center gap-8">
            {hasUser ? (
              <>
                <Link href="/careers" className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                  Careers
                </Link>
                <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                  Profile
                </Link>
                <Link href="/predictor" className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                  Predictor
                </Link>
                <Button variant="outline" onClick={handleSignOut} className="text-sm border-gray-300 hover:border-kaggle-blue hover:text-kaggle-blue">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setOpenAuth('signup')} className="text-sm border-gray-300 hover:border-kaggle-blue hover:text-kaggle-blue">
                  Sign up
                </Button>
                <Button onClick={() => setOpenAuth('login')} className="text-sm">
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-700">AI-Powered Career Guidance</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-kaggle-navy">
              Your Future,
              <br />
              <span className="text-kaggle-blue">Powered by AI</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover your ideal career path with AI-driven predictions, personalized learning roadmaps, and an intelligent virtual teacher guiding you every step of the way.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {hasUser ? (
                <>
                  <Button href={'/predictor'} className="text-sm px-6 py-3">
                    <span className="flex items-center gap-2">
                      Start Your Journey
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                  <Button variant="outline" href={'/profile'} className="text-sm px-6 py-3 border-gray-300">
                    Complete Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setOpenAuth('signup')} className="text-sm px-6 py-3">
                    <span className="flex items-center gap-2">
                      Get Started Free
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                  <Button variant="outline" onClick={() => setOpenAuth('login')} className="text-sm px-6 py-3 border-gray-300">
                    Already have an account?
                  </Button>
                </>
              )}
            </div>


            {/* Stats */}
            <div className="flex gap-8 pt-6 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-kaggle-navy">14+</div>
                <div className="text-sm text-gray-600 mt-1">Career Paths</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-kaggle-navy">1000+</div>
                <div className="text-sm text-gray-600 mt-1">Resources</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-kaggle-blue">AI</div>
                <div className="text-sm text-gray-600 mt-1">Powered</div>
              </div>
            </div>
          </div>

          {/* Right content - Feature cards */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-white rounded p-6 shadow-card hover:shadow-card-hover transition-shadow border border-gray-200">
              <div className="w-12 h-12 bg-kaggle-blue rounded flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-kaggle-navy mb-2">AI Career Prediction</h3>
              <p className="text-gray-600 text-sm">Advanced AI analyzes your skills and interests to recommend the perfect career path tailored for you.</p>
            </div>

            <div className="bg-white rounded p-6 shadow-card hover:shadow-card-hover transition-shadow border border-gray-200">
              <div className="w-12 h-12 bg-kaggle-blue rounded flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-kaggle-navy mb-2">Personalized Roadmaps</h3>
              <p className="text-gray-600 text-sm">Step-by-step learning paths with curated resources to master your chosen career efficiently.</p>
            </div>

            <div className="bg-white rounded p-6 shadow-card hover:shadow-card-hover transition-shadow border border-gray-200">
              <div className="w-12 h-12 bg-kaggle-blue rounded flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-kaggle-navy mb-2">Virtual AI Teacher</h3>
              <p className="text-gray-600 text-sm">Get instant answers and guidance from your personal AI assistant available 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={!!openAuth} mode={openAuth ?? 'login'} onClose={() => setOpenAuth(null)} />
    </main>
  )
}
