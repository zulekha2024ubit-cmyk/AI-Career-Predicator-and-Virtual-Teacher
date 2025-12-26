"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppNavbar } from '@/components/AppNavbar'
import { FloatingChatWidget } from '@/components/FloatingChatWidget'
import { Button } from '@/components/Button'

type Project = {
  title: string
  description: string
  difficulty: string
  duration: string
  skills: string[]
  tasks: string[]
}

type Roadmap = {
  slug: string
  title: string
  projects?: Project[]
}

export default function ProjectsPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const res = await fetch(`/roadmaps/${slug}.json`)
        if (res.ok) {
          setRoadmap(await res.json())
        } else {
          console.error('Failed to load roadmap:', res.statusText)
        }
      } catch (error) {
        console.error('Error loading roadmap:', error)
      }
    }
    if (slug) loadRoadmap()
  }, [slug])

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-kaggle-light">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-kaggle-blue rounded mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-kaggle-navy mb-3">
              Recommended Projects
            </h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Congratulations on completing the <span className="font-semibold text-kaggle-navy">{roadmap?.title}</span> roadmap! Here are some project ideas to help you apply your newly acquired skills and build an impressive portfolio.
            </p>
          </div>

          {/* Projects Grid */}
          {roadmap?.projects && roadmap.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {roadmap.projects.map((project, idx) => (
                <div key={idx} className="bg-white rounded p-5 shadow-card hover:shadow-card-hover transition-shadow border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-kaggle-navy">{project.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{project.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{project.duration}</span>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Skills you'll use:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-kaggle-light text-kaggle-dark rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Key Tasks:</p>
                  <ul className="space-y-1">
                    {project.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="text-xs text-gray-600 flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-kaggle-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Projects coming soon...</p>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="bg-white rounded p-6 border border-gray-200 shadow-card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-kaggle-navy mb-2">Continue Your Journey</h2>
            <p className="text-gray-600 text-sm">
              Ready to explore more opportunities and expand your skillset?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-3 max-w-xl mx-auto">
            <Button
              onClick={() => router.push(`/roadmap/${slug as string}` as any)}
              variant="outline"
              className="flex items-center justify-center gap-2 flex-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Roadmap</span>
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex items-center justify-center gap-2 flex-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go to Home</span>
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Button
              onClick={() => router.push('/careers')}
              className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[280px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Explore More Careers</span>
            </Button>
          </div>
        </div>

        <FloatingChatWidget />
      </div>
    </main>
    </>
  )
}
