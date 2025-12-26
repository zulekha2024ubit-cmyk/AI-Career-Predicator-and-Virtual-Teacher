"use client"
import React, { useState } from 'react'
import { AppNavbar } from '@/components/AppNavbar'
import Link from 'next/link'

// Simplified career metadata (removed gradient color props for cleaner theme)
const careers = [
  { 
    slug: 'full-stack-web-development', 
    title: 'Full Stack Web Development', 
    icon: '🌐',
    description: 'Build complete web applications from frontend to backend'
  },
  { 
    slug: 'frontend-developer', 
    title: 'Frontend Developer', 
    icon: '🎨',
    description: 'Create stunning user interfaces and experiences'
  },
  { 
    slug: 'backend-development', 
    title: 'Backend Development', 
    icon: '🔧',
    description: 'Design and build server-side systems and APIs'
  },
  { 
    slug: 'data-science-ml', 
    title: 'Data Science & ML', 
    icon: '📊',
    description: 'Extract insights and build predictive models from data'
  },
  { 
    slug: 'ai-ml-engineer', 
    title: 'AI/ML Engineer', 
    icon: '🤖',
    description: 'Develop intelligent systems and neural networks'
  },
  { 
    slug: 'data-engineer', 
    title: 'Data Engineer', 
    icon: '🏗️',
    description: 'Build scalable data pipelines and infrastructure'
  },
  { 
    slug: 'cybersecurity', 
    title: 'Cybersecurity', 
    icon: '🔒',
    description: 'Protect systems and data from security threats'
  },
  { 
    slug: 'devops-engineer', 
    title: 'DevOps Engineer', 
    icon: '⚙️',
    description: 'Automate deployment and infrastructure management'
  },
  { 
    slug: 'cloud-engineer', 
    title: 'Cloud Engineer', 
    icon: '☁️',
    description: 'Design and manage cloud-based solutions'
  },
  { 
    slug: 'mobile-app-development', 
    title: 'Mobile App Development', 
    icon: '📱',
    description: 'Create native and cross-platform mobile apps'
  },
  { 
    slug: 'game-development', 
    title: 'Game Development', 
    icon: '🎮',
    description: 'Build interactive games and immersive experiences'
  },
  { 
    slug: 'blockchain-development', 
    title: 'Blockchain Development', 
    icon: '⛓️',
    description: 'Develop decentralized applications and smart contracts'
  },
  { 
    slug: 'qa-testing-engineer', 
    title: 'QA & Testing Engineer', 
    icon: '🧪',
    description: 'Ensure software quality through testing and automation'
  },
  { 
    slug: 'ui-ux-design', 
    title: 'UI/UX Design', 
    icon: '🎯',
    description: 'Design beautiful and user-centered digital experiences'
  }
]

export default function CareersPage() {
  const [filter, setFilter] = useState('all')
  
  const categories = [
    { id: 'all', label: 'All Careers' },
    { id: 'development', label: 'Development' },
    { id: 'data', label: 'Data & AI' },
    { id: 'design', label: 'Design' },
    { id: 'other', label: 'Other' }
  ]

  const getCategoryForCareer = (slug: string) => {
    if (['frontend-developer', 'backend-development', 'full-stack-web-development', 'mobile-app-development'].includes(slug)) return 'development'
    if (['data-science-ml', 'ai-ml-engineer', 'data-engineer'].includes(slug)) return 'data'
    if (['ui-ux-design'].includes(slug)) return 'design'
    return 'other'
  }

  const filteredCareers = filter === 'all' 
    ? careers 
    : careers.filter(c => getCategoryForCareer(c.slug) === filter)

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-kaggle-light">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-kaggle-navy mb-3">
              Explore Career Paths
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Discover comprehensive roadmaps designed to guide you from beginner to expert. Each path includes structured learning resources, practical projects, and industry insights.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  filter === cat.id
                    ? 'bg-kaggle-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          {/* Career Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {filteredCareers.map((career) => (
              <Link 
                key={career.slug}
                href={`/roadmap/${career.slug}`}
                className="group bg-white rounded p-5 shadow-card hover:shadow-card-hover transition-shadow border border-gray-200"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-kaggle-light rounded flex items-center justify-center mb-4">
                  <span className="text-2xl">{career.icon}</span>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-kaggle-navy mb-2 group-hover:text-kaggle-blue transition-colors">
                  {career.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {career.description}
                </p>
                
                {/* View Roadmap Link */}
                <div className="flex items-center text-sm font-medium text-kaggle-blue">
                  <span>View Roadmap</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded p-8 text-center border border-gray-200 shadow-card">
            <div className="max-w-xl mx-auto">
              <div className="w-14 h-14 bg-kaggle-blue rounded flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-kaggle-navy mb-2">Not Sure Which Path to Choose?</h2>
              <p className="text-gray-600 text-sm mb-5">
                Let our AI-powered Career Predictor analyze your skills, interests, and goals to recommend the perfect career path for you.
              </p>
              <Link 
                href="/predictor" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-kaggle-blue text-white text-sm font-semibold rounded hover:bg-[#1BA8E0] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Try Career Predictor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
