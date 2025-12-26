"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileInput, ProfileSchema } from '@/lib/validators'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { MultiTagInput } from '@/components/MultiTagInput'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { AppNavbar } from '@/components/AppNavbar'

export default function ProfilePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      gender: undefined,
      age: undefined,
      country: '',
      city: '',
      current_level: undefined,
      class_year: '',
      field_of_study: '',
      institute_name: '',
      favorite_subjects: [],
      weak_subjects: [],
      technical_skills: [],
      soft_skills: [],
      career_interests: [],
      hobbies: '',
      dream_career: '',
      why_career: '',
      work_type: undefined,
      motivation: 5,
      linkedin: '',
      github: '',
      resume_url: ''
    }
  })

  // Load auth user and existing profile (if any)
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUserEmail(user.email ?? '')
      form.setValue('email', user.email ?? '')
      const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle()
      if (data) {
        Object.entries(data).forEach(([k, v]) => {
          // @ts-expect-error dynamic assignment into RHF
          if (k in form.getValues()) form.setValue(k, v as any)
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const level = form.watch('current_level')

  // Local auto-save to storage
  useEffect(() => {
    const sub = form.watch((val) => {
      try { localStorage.setItem('profile_draft', JSON.stringify(val)) } catch {}
    })
    return () => sub.unsubscribe()
  }, [form])

  useEffect(() => {
    try {
      const draft = localStorage.getItem('profile_draft')
      if (draft) {
        form.reset(JSON.parse(draft))
      }
    } catch {}
  }, [])

  const completion = useMemo(() => {
    const v = form.getValues()
    const required: (keyof ProfileInput)[] = ['full_name', 'email', 'current_level', 'field_of_study', 'career_interests']
    const filled = required.filter((k) => {
      const value = v[k]
      if (Array.isArray(value)) return value.length > 0
      return Boolean(value)
    })
    return Math.round((filled.length / required.length) * 100)
  }, [form.watch()])

  const onSave = async (goNext?: boolean) => {
    setSaved(false)
    const ok = await form.trigger()
    if (!ok) {
      alert('❌ Please fix the validation errors before saving.')
      return
    }
    const input = form.getValues()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please login first.')
      return
    }
    try {
      const payload = { id: user.id, ...input }
      const { error } = await supabase.from('user_profiles').upsert(payload, { onConflict: 'id' })
      if (error) throw error
      setSaved(true)
      if (goNext) {
        router.push('/predictor')
      } else {
        alert('✅ Profile saved successfully!')
      }
    } catch (e: any) {
      console.error('Save error:', e)
      alert('❌ Failed to save profile: ' + (e?.message ?? 'Unknown error'))
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
  if (!userEmail) return (
    <>
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="card text-center">
          <h1 className="text-2xl font-semibold mb-4">Login Required</h1>
          <p className="text-gray-600 mb-4">Please go back and login to create your profile.</p>
          <Button href="/">Go to Landing</Button>
        </div>
      </main>
    </>
  )

  return (
    <>
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-kaggle-navy mb-4">
            Build Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us understand your background, skills, and aspirations to provide personalized career recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white rounded p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
              <span className="text-2xl font-bold text-kaggle-blue">{completion}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-kaggle-blue rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Complete all required fields to get the best career predictions</p>
          </div>
        </div>

      <div className="space-y-6">
        {/* Personal Details */}
        <section className="bg-white rounded p-8 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input label="Full Name" value={form.watch('full_name') ?? ''} onChange={(e) => form.setValue('full_name', e.target.value)} />
            <Input label="Email" value={userEmail} readOnly />
            <Select label="Gender" value={form.watch('gender') ?? ''} onChange={(e) => form.setValue('gender', e.target.value as any)} options={[{value:'',label:'Select…'},{ value:'male', label:'Male' },{ value:'female', label:'Female' },{ value:'prefer_not_to_say', label:'Prefer not to say' }]} />
            <Input label="Age" type="number" value={(form.watch('age') as any) ?? ''} onChange={(e) => form.setValue('age', Number(e.target.value))} />
            <Input label="Country" value={form.watch('country') ?? ''} onChange={(e) => form.setValue('country', e.target.value)} />
            <Input label="City" value={form.watch('city') ?? ''} onChange={(e) => form.setValue('city', e.target.value)} />
          </div>
        </section>

        {/* Education Level */}
        <section className="bg-white rounded p-8 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Education Level</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select label="Current Level" value={form.watch('current_level') ?? ''} onChange={(e) => form.setValue('current_level', e.target.value as any)} options={[{value:'',label:'Select…'},{ value:'matric', label:'Matric' },{ value:'intermediate', label:'Intermediate' },{ value:'bachelor', label:'Bachelor' },{ value:'master', label:'Master' }]} />
            <Input label="Class or Year" value={form.watch('class_year') ?? ''} onChange={(e) => form.setValue('class_year', e.target.value)} />
            <Input label="Field of Study" value={form.watch('field_of_study') ?? ''} onChange={(e) => form.setValue('field_of_study', e.target.value)} />
            <Input label="Institute Name" value={form.watch('institute_name') ?? ''} onChange={(e) => form.setValue('institute_name', e.target.value)} />
          </div>
        </section>

        {/* Subjects */}
        <section className="bg-white rounded p-8 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Academic Strengths</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <MultiTagInput label="Favorite Subjects" values={form.watch('favorite_subjects') ?? []} onChange={(v) => form.setValue('favorite_subjects', v)} placeholder="Math, English, Computer" />
            <MultiTagInput label="Weak Subjects (Optional)" values={form.watch('weak_subjects') ?? []} onChange={(v) => form.setValue('weak_subjects', v)} placeholder="Physics" />
          </div>
        </section>

        {/* Skills and Interests */}
        <section className="bg-white rounded p-8 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Skills & Interests</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <MultiTagInput label="Technical Skills" values={form.watch('technical_skills') ?? []} onChange={(v) => form.setValue('technical_skills', v)} placeholder="Python, Canva, Excel" />
            <MultiTagInput label="Soft Skills" values={form.watch('soft_skills') ?? []} onChange={(v) => form.setValue('soft_skills', v)} placeholder="Creativity, Teamwork" />
            <MultiTagInput label="Career Interests" values={form.watch('career_interests') ?? []} onChange={(v) => form.setValue('career_interests', v)} placeholder="AI, Design, Business" />
            <Input label="Hobbies" value={form.watch('hobbies') ?? ''} onChange={(e) => form.setValue('hobbies', e.target.value)} />
          </div>
        </section>

        {/* Career Goals */}
        <section className="bg-white rounded p-8 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Career Vision</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input label="Dream Career" value={form.watch('dream_career') ?? ''} onChange={(e) => form.setValue('dream_career', e.target.value)} />
            <Select label="Work Type Preference" value={form.watch('work_type') ?? ''} onChange={(e) => form.setValue('work_type', e.target.value as any)} options={[{value:'',label:'Select…'},{ value:'remote', label:'Remote' },{ value:'on-site', label:'On-site' },{ value:'hybrid', label:'Hybrid' }]} />
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-gray-700">Why You Want It (Optional)</span>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-kaggle-blue focus:border-transparent transition-all min-h-[100px] resize-none" value={form.watch('why_career') ?? ''} onChange={(e) => form.setValue('why_career', e.target.value)} placeholder="Share your motivation and career goals..." />
            </label>
            <label className="block md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Motivation Level</span>
                <span className="text-xl font-bold text-kaggle-blue">{form.watch('motivation') ?? 5}/10</span>
              </div>
              <input type="range" min={0} max={10} value={(form.watch('motivation') as any) ?? 5} onChange={(e) => form.setValue('motivation', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kaggle-blue" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </label>
          </div>
        </section>

        {/* Additional Info (only for Bachelor/Master) */}
        {(level === 'bachelor' || level === 'master') && (
          <section className="bg-white rounded p-8 shadow-card border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Professional Links</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input label="LinkedIn Profile" placeholder="https://linkedin.com/in/username" value={form.watch('linkedin') ?? ''} onChange={(e) => form.setValue('linkedin', e.target.value)} />
              <Input label="GitHub / Portfolio" placeholder="https://github.com/username" value={form.watch('github') ?? ''} onChange={(e) => form.setValue('github', e.target.value)} />
              <Input label="Resume URL" placeholder="https://drive.google.com/.../resume.pdf" value={form.watch('resume_url') ?? ''} onChange={(e) => form.setValue('resume_url', e.target.value)} />
            </div>
          </section>
        )}

        {/* Save & Continue */}
        <section className="bg-white rounded p-8 shadow-card border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {saved ? (
                <>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-700">Profile Saved Successfully!</p>
                    <p className="text-sm text-green-600">You can now proceed to the Career Predictor</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Ready to Save?</p>
                    <p className="text-sm text-gray-600">Complete all required fields before proceeding</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onSave(false)} className="px-6 py-3">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Profile
                </span>
              </Button>
              <Button onClick={() => onSave(true)} className="px-6 py-3">
                <span className="flex items-center gap-2">
                  Career Predictor
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  )
}
