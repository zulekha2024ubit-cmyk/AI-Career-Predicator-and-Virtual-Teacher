"use client"
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { AppNavbar } from '@/components/AppNavbar'
import { enhancedHeuristicMatch } from '@/lib/careerMatcher'
import { careerProfiles, CareerSlug } from '@/lib/careerProfiles'
import type { aiCareerPrediction as aiCareerPredictionType } from '@/lib/aiCareerPredictor'

type Profile = any

export default function PredictorPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<null | {
    careerSlug: string
    careerTitle: string
    reasoning: string
    fitScore: number
    otherRecommendations: { slug: string; label: string; value: number }[]
  }>(null)
  const [generating, setGenerating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle()
      
      // IMPORTANT: Ensure arrays are actually arrays (database might return strings)
      if (data) {
        if (typeof data.technical_skills === 'string') {
          data.technical_skills = data.technical_skills ? JSON.parse(data.technical_skills) : [];
        }
        if (typeof data.career_interests === 'string') {
          data.career_interests = data.career_interests ? JSON.parse(data.career_interests) : [];
        }
        if (typeof data.soft_skills === 'string') {
          data.soft_skills = data.soft_skills ? JSON.parse(data.soft_skills) : [];
        }
        if (typeof data.favorite_subjects === 'string') {
          data.favorite_subjects = data.favorite_subjects ? JSON.parse(data.favorite_subjects) : [];
        }
        if (typeof data.weak_subjects === 'string') {
          data.weak_subjects = data.weak_subjects ? JSON.parse(data.weak_subjects) : [];
        }
      }
      
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Reload profile when user returns to this page (tab focus)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible, reloading profile...')
        setRefreshing(true)
        loadProfile()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [loadProfile])

  const summary = useMemo(() => {
    if (!profile) return null
    return {
      education: `${profile.current_level ?? 'N/A'} (${profile.field_of_study ?? 'N/A'})`,
      skills: (profile.technical_skills ?? []).join(', '),
      interests: (profile.career_interests ?? []).join(', '),
      goals: profile.dream_career ?? 'N/A'
    }
  }, [profile])

  const generate = async () => {
    if (!profile) return
    setGenerating(true)
    setResult(null)
    try {
      const scores = enhancedHeuristicMatch({
        technical_skills: profile.technical_skills || [],
        career_interests: profile.career_interests || [],
        favorite_subjects: profile.favorite_subjects || [],
        soft_skills: profile.soft_skills || [],
        field_of_study: profile.field_of_study || '',
        dream_career: profile.dream_career || '',
        motivation: profile.motivation || 5
      })
      const topMatch = scores[0]
      const others = scores.slice(1, 6)
      setResult({
        careerTitle: titleFor(topMatch.slug),
        careerSlug: topMatch.slug,
        fitScore: topMatch.score,
        reasoning: generateReasoning(profile, topMatch.slug),
        otherRecommendations: others.map(item => ({
          slug: item.slug,
          label: titleFor(item.slug),
          value: item.score
        }))
      })
    } catch (e) {
      console.error('Prediction error', e)
    } finally {
      setGenerating(false)
    }
  }

  function generateReasoning(prof: any, slug: string): string {
    const careerProfile = careerProfiles[slug as CareerSlug];
    if (!careerProfile) return 'Great match based on your profile!';
    
    const reasons = [];
    
    if (prof.dream_career?.toLowerCase().includes(careerProfile.title.toLowerCase()) ||
        careerProfile.title.toLowerCase().includes(prof.dream_career?.toLowerCase() || '')) {
      reasons.push("it aligns perfectly with your dream career");
    }
    
    if (prof.technical_skills?.some((s: string) => 
      careerProfile.keywords.some(kw => s.toLowerCase().includes(kw) || kw.includes(s.toLowerCase()))
    )) {
      reasons.push("your technical skills are a strong fit");
    }
    
    if (prof.career_interests?.some((i: string) => 
      careerProfile.interests.some(ci => i.toLowerCase().includes(ci) || ci.includes(i.toLowerCase()))
    )) {
      reasons.push("it matches your career interests");
    }
    
    if (prof.field_of_study && careerProfile.fields.some(f => 
      prof.field_of_study.toLowerCase().includes(f) || f.includes(prof.field_of_study.toLowerCase())
    )) {
      reasons.push("your education background is highly relevant");
    }
    
    if (prof.soft_skills?.some((s: string) => 
      careerProfile.softSkills.some(ss => s.toLowerCase().includes(ss) || ss.includes(s.toLowerCase()))
    )) {
      reasons.push("your soft skills complement this career well");
    }
    
    if (reasons.length === 0) {
      return "Your overall profile shows strong potential for this career path based on AI analysis!";
    }
    
    if (reasons.length === 1) {
      return `This career is an excellent match because ${reasons[0]}.`;
    }
    
    const lastReason = reasons.pop();
    return `This career is an excellent match because ${reasons.join(', ')}, and ${lastReason}.`;
  }

  const savePrediction = async () => {
    if (!profile || !result) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please login first.')
        return
      }
      const { error } = await supabase.from('user_profiles').update({ selected_career_slug: result.careerSlug }).eq('id', user.id)
      if (error) throw error
      alert('✅ Prediction saved to profile successfully!')
    } catch (e: any) {
      console.error('Save error:', e)
      alert('❌ Failed to save prediction: ' + (e?.message ?? 'Unknown error'))
    }
  }

  if (loading) return (
    <>
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <LoadingSpinner message="Loading your profile..." />
      </main>
    </>
  )
  if (!profile) return (
    <>
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="card text-center">
          <h1 className="text-2xl font-semibold mb-4">Profile Required</h1>
          <p className="text-gray-600 mb-4">Please create your profile first to use the career predictor.</p>
          <Button href="/profile">Create Profile</Button>
        </div>
      </main>
    </>
  )

  return (
    <>
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-kaggle-navy mb-4">
            Career Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized career recommendations tailored to your unique profile.
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded p-8 shadow-card border border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Profile Summary</h2>
                <p className="text-sm text-gray-600">Based on the information you provided</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setRefreshing(true); loadProfile(); }}
                  disabled={refreshing}
                  className="text-sm text-gray-600 hover:text-kaggle-blue font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <Link href="/profile" className="text-sm text-kaggle-blue hover:text-kaggle-navy font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Education</h3>
                  <p className="text-base text-gray-900">{summary?.education}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Career Goals</h3>
                  <p className="text-base text-gray-900">{summary?.goals}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Technical Skills</h3>
                  <p className="text-base text-gray-900 font-medium">{summary?.skills || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Career Interests</h3>
                  <p className="text-base text-gray-900">{summary?.interests || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button
                className="w-full md:w-auto text-base px-8 py-4 shadow-card hover:shadow-card-hover transition-all"
                onClick={generate}
                disabled={generating}
              >
                <span className="flex items-center gap-2">
                  {generating && (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {generating ? 'Generating Recommendation...' : 'Generate Career Prediction'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-green-800">Prediction Complete</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Career Path</h2>
              <p className="text-gray-600">Here are your top recommended career paths based on your profile data.</p>
            </div>

            {/* Main Recommendation Card */}
            <div className="bg-kaggle-blue rounded p-8 mb-8 text-white shadow-card-hover">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">RECOMMENDED CAREER PATH</p>
                  <h3 className="text-3xl font-bold mb-3">{result.careerTitle}</h3>
                  <p className="text-white/90 leading-relaxed">{result.reasoning}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-3">
                <Link className="btn bg-white text-kaggle-blue hover:bg-gray-50 font-semibold px-6 py-3" href={`/roadmap/${result.careerSlug}`}>
                  View Full Roadmap →
                </Link>
                <Link className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3" href={`/learn/${result.careerSlug}?step=0`}>
                  Start Learning
                </Link>
              </div>
            </div>

            {/* Other Recommended Careers */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Other Recommended Career Paths</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.otherRecommendations.map((rec) => (
                  <Link 
                    key={rec.slug}
                    href={`/roadmap/${rec.slug}`}
                    className="bg-white rounded p-5 shadow-card border border-gray-100 hover:shadow-card-hover hover:scale-105 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-kaggle-blue transition-colors flex-1">
                        {rec.label}
                      </h3>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-kaggle-blue group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 font-medium">Match Score</span>
                          <span className="text-gray-900 font-bold">{rec.value}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-kaggle-blue rounded-full transition-all duration-500"
                            style={{ width: `${rec.value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={savePrediction} className="text-base px-8 py-4 shadow-card hover:shadow-card-hover transition-all">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save to Profile
                </span>
              </Button>
              <Button variant="outline" onClick={() => setResult(null)} className="text-base px-8 py-4 hover:shadow-card transition-all">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New Prediction
                </span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

function titleFor(slug: string) {
  const titles: { [key: string]: string } = {
    'full-stack-web-development': 'Full Stack Web Developer',
    'frontend-developer': 'Frontend Developer',
    'backend-development': 'Backend Developer',
    'data-science-ml': 'Data Scientist',
    'ai-ml-engineer': 'AI/ML Engineer',
    'data-engineer': 'Data Engineer',
    'cybersecurity': 'Cybersecurity Specialist',
    'devops-engineer': 'DevOps Engineer',
    'cloud-engineer': 'Cloud Engineer',
    'mobile-app-development': 'Mobile App Developer',
    'game-development': 'Game Developer',
    'blockchain-development': 'Blockchain Developer',
    'qa-testing-engineer': 'QA/Testing Engineer',
    'ui-ux-design': 'UI/UX Designer'
  }
  return titles[slug] || 'Full Stack Web Developer'
}

function personalityFor(slug: string) {
  const personalities: { [key: string]: string } = {
    'full-stack-web-development': 'Versatile and adaptable; comfortable with both frontend and backend technologies.',
    'frontend-developer': 'Creative and detail-oriented; passionate about user experience and visual design.',
    'backend-development': 'Logical thinker; enjoys working with databases, APIs, and server-side architecture.',
    'data-science-ml': 'Analytical and curious; comfortable with data and experimentation.',
    'ai-ml-engineer': 'Innovative and research-oriented; fascinated by intelligent systems and automation.',
    'data-engineer': 'Detail-oriented and systematic; skilled at building robust data pipelines.',
    'cybersecurity': 'Detail-oriented and vigilant; enjoys protecting systems and finding vulnerabilities.',
    'devops-engineer': 'Automation-focused and collaborative; bridges development and operations.',
    'cloud-engineer': 'Strategic thinker; skilled at designing scalable cloud infrastructure.',
    'mobile-app-development': 'User-focused and creative; passionate about mobile experiences.',
    'game-development': 'Creative and technical; enjoys bringing interactive experiences to life.',
    'blockchain-development': 'Innovative and security-conscious; interested in decentralized systems.',
    'qa-testing-engineer': 'Meticulous and thorough; committed to software quality and reliability.',
    'ui-ux-design': 'Empathetic and creative; passionate about user-centered design.'
  }
  return personalities[slug] || 'Versatile and adaptable; comfortable with both frontend and backend technologies.'
}

function getCoursesFor(slug: string) {
  const courses: { [key: string]: string[] } = {
    'full-stack-web-development': ['BS Computer Science', 'Online: React, Node.js, Databases'],
    'frontend-developer': ['BS Computer Science', 'Online: HTML/CSS, JavaScript, React'],
    'backend-development': ['BS Computer Science', 'Online: Node.js, Python, Database Design'],
    'data-science-ml': ['BS Data Science', 'Online: Python, Pandas, ML, Statistics'],
    'ai-ml-engineer': ['BS AI/ML', 'Online: Deep Learning, TensorFlow, PyTorch'],
    'data-engineer': ['BS Computer Science', 'Online: SQL, Spark, Data Pipelines'],
    'cybersecurity': ['BS Cybersecurity', 'Online: Networking, Security Fundamentals'],
    'devops-engineer': ['BS Computer Science', 'Online: Docker, Kubernetes, CI/CD'],
    'cloud-engineer': ['BS Computer Science', 'Online: AWS/Azure, Cloud Architecture'],
    'mobile-app-development': ['BS Computer Science', 'Online: React Native, Flutter'],
    'game-development': ['BS Game Development', 'Online: Unity, Unreal Engine, C#'],
    'blockchain-development': ['BS Computer Science', 'Online: Solidity, Web3, Blockchain'],
    'qa-testing-engineer': ['BS Computer Science', 'Online: Selenium, Test Automation'],
    'ui-ux-design': ['BS Design/HCI', 'Online: Figma, User Research, Design Systems']
  }
  return courses[slug] || ['BS Computer Science', 'Online: Programming Fundamentals']
}
