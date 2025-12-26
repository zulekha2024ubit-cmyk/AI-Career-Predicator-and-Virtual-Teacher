"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { FloatingChatWidget } from '@/components/FloatingChatWidget'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/Button'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { AppNavbar } from '@/components/AppNavbar'

type Quiz = {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

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
  steps: { 
    id: string
    title: string
    description?: string
    resources?: Array<{
      title: string
      url: string
      type: string
      duration?: string
      note?: string
    }>
    quiz?: Quiz[]
  }[]
  projects?: Project[]
}

export default function LearnPage() {
  const params = useParams<{ slug: string }>()
  const search = useSearchParams()
  const router = useRouter()
  const slug = params?.slug
  const index = Number(search.get('step') ?? '0')
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [selectedResource, setSelectedResource] = useState<{ title: string; url: string; type?: string } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [showProjects, setShowProjects] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const iframeContainerRef = React.useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return
    
    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleQuizSubmit = () => {
    if (!step?.quiz) return
    
    let correct = 0
    step.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correct++
      }
    })
    
    const score = Math.round((correct / step.quiz.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    
    // Mark step as completed if quiz passed (70% or higher)
    if (score >= 70) {
      setCompletedSteps(prev => new Set([...prev, index]))
    }
  }

  const handleNextStep = () => {
    setShowQuiz(false)
    setQuizSubmitted(false)
    setQuizAnswers({})
    setQuizScore(0)
    setSelectedResource(null)
    next()
  }

  const isLastStep = index >= (roadmap?.steps.length ?? 1) - 1

  useEffect(() => {
    // Generate quiz based on step description
    const generateQuizForStep = (step: any): Quiz[] => {
      // Create contextual questions based on step title and description
      const quizzes: Quiz[] = []
      const title = step.title.toLowerCase()
      
      // Add 3 questions per step based on common topics
      if (title.includes('html') || title.includes('basics') || title.includes('fundamental')) {
        quizzes.push(
          {
            question: `What is the primary purpose of ${step.title}?`,
            options: [
              'To style web pages',
              'To structure and understand core concepts',
              'To add interactivity only',
              'To manage databases'
            ],
            correctAnswer: 1,
            explanation: `${step.title} is fundamental for creating the structure and foundation of your learning path.`
          },
          {
            question: 'Which best practice should you follow when learning this topic?',
            options: [
              'Skip documentation',
              'Practice with real examples',
              'Only watch videos',
              'Memorize everything'
            ],
            correctAnswer: 1,
            explanation: 'Hands-on practice with real examples is the most effective way to master any technology.'
          },
          {
            question: 'What should you do after completing this section?',
            options: [
              'Move to next immediately',
              'Review and practice',
              'Skip to advanced topics',
              'Stop learning'
            ],
            correctAnswer: 1,
            explanation: 'Reviewing and practicing what you learned helps reinforce concepts and build muscle memory.'
          }
        )
      } else {
        // Generic questions for any topic
        quizzes.push(
          {
            question: `What is the main focus of ${step.title}?`,
            options: [
              'Understanding core concepts',
              'Memorizing syntax',
              'Speed of development',
              'Tool installation only'
            ],
            correctAnswer: 0,
            explanation: `Understanding core concepts of ${step.title} is essential for building strong fundamentals.`
          },
          {
            question: `How should you approach learning ${step.title}?`,
            options: [
              'Theory only',
              'Practice only',
              'Combination of theory and practice',
              'Wait for instructor'
            ],
            correctAnswer: 2,
            explanation: 'A balanced approach combining theoretical knowledge with practical application yields the best results.'
          },
          {
            question: 'What should you do after completing this section?',
            options: [
              'Move to next immediately',
              'Review and practice',
              'Skip to advanced topics',
              'Stop learning'
            ],
            correctAnswer: 1,
            explanation: 'Reviewing and practicing what you learned helps reinforce concepts and build muscle memory.'
          }
        )
      }
      
      return quizzes
    }

    const loadRoadmap = async () => {
      try {
        const res = await fetch(`/roadmaps/${slug}.json`)
        if (res.ok) {
          const data = await res.json()
          // Generate quizzes for steps that don't have them
          const stepsWithQuizzes = data.steps.map((step: any) => ({
            ...step,
            quiz: step.quiz || generateQuizForStep(step)
          }))
          setRoadmap({ ...data, steps: stepsWithQuizzes })
        } else {
          console.error('Failed to load roadmap:', res.statusText)
        }
      } catch (error) {
        console.error('Error loading roadmap:', error)
      }
    }
    if (slug) loadRoadmap()
  }, [slug])

  const step = useMemo(() => roadmap?.steps?.[index] ?? null, [roadmap, index])

  const next = () => {
    const nextIndex = Math.min((roadmap?.steps.length ?? 1) - 1, index + 1)
    router.push(`?step=${nextIndex}`)
  }
  const prev = () => {
    const prevIndex = Math.max(0, index - 1)
    router.push(`?step=${prevIndex}`)
  }

  return (
    <>
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-kaggle-navy mb-2">
                {roadmap?.title || 'Loading...'}
              </h1>
              {roadmap && (
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-kaggle-blue">Step {index + 1}</span>
                  <span className="text-gray-400">/</span>
                  <span>{roadmap.steps.length}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {Math.round(((index + 1) / roadmap.steps.length) * 100)}% Complete
                  </span>
                </p>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {roadmap && (
            <div className="bg-white rounded p-4 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Course Progress</span>
                <span className="text-sm text-gray-600">{index + 1} of {roadmap.steps.length} steps</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-kaggle-blue rounded-full transition-all duration-500"
                  style={{ width: `${((index + 1) / roadmap.steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Resources list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded p-6 shadow-card border border-gray-100 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {!step ? (
                <LoadingSpinner message="Loading learning materials..." />
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900">{step.title}</h2>
                    </div>
                  </div>
                  
                  {step.description && (
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed bg-kaggle-light p-4 rounded border border-gray-200">
                      {step.description}
                    </p>
                  )}

                  {/* Resources from JSON file */}
                  {step.resources && step.resources.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-kaggle-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Learning Resources
                      </h3>
                      <div className="space-y-2">
                        {step.resources.map((resource, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedResource({ title: resource.title, url: resource.url, type: resource.type })}
                            className={`w-full text-left p-4 rounded border-2 transition-all ${
                              selectedResource?.url === resource.url
                                ? 'bg-kaggle-light border-kaggle-blue shadow-card'
                                : 'bg-white border-gray-200 hover:border-kaggle-blue hover:shadow-card'
                            }`}
                          >
                            <div className="font-semibold text-sm text-gray-900 mb-2">
                              {resource.title}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="px-2 py-1 bg-kaggle-blue/10 text-kaggle-blue rounded text-xs font-medium">
                                {resource.type}
                              </span>
                              {resource.duration && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {resource.duration}
                                </span>
                              )}
                              {resource.note && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                                  ⭐ {resource.note}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Take Quiz Button */}
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full mb-4 bg-kaggle-blue text-white py-4 rounded font-semibold hover:shadow-card-hover transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>Take Quiz for this Section</span>
                  </button>

                  <div className="pt-4 border-t border-gray-200 flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={prev} 
                      disabled={index === 0} 
                      className="flex-1 py-3"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </span>
                    </Button>
                    
                    {isLastStep ? (
                      <Button 
                        onClick={() => router.push(`/roadmap/${slug as string}/projects` as any)}
                        className="flex-1 py-3 bg-kaggle-blue hover:bg-kaggle-navy"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Projects
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Button>
                    ) : (
                      <Button 
                        onClick={next} 
                        disabled={index >= (roadmap?.steps.length ?? 1) - 1} 
                        className="flex-1 py-3"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Next
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Embedded content viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded p-6 shadow-card border border-gray-100 overflow-hidden">
              {selectedResource ? (
                <div className="flex flex-col" ref={iframeContainerRef}>
                  <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-kaggle-light">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{selectedResource.title}</h3>
                        {selectedResource.type && (
                          <span className="text-xs text-gray-600">
                            {selectedResource.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={toggleFullscreen}
                        className="px-4 py-2 text-sm bg-kaggle-blue hover:bg-kaggle-navy text-white rounded transition-all flex items-center gap-2 font-medium shadow-card hover:shadow-card-hover"
                        title={isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen"}
                      >
                        {isFullscreen ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Exit
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Fullscreen
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedResource(null)}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-all font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="relative" style={{ minHeight: selectedResource.type?.toLowerCase() === 'video' ? '500px' : '600px' }}>
                    <iframe
                      src={selectedResource.url}
                      className="w-full h-full border-0"
                      style={{ minHeight: selectedResource.type?.toLowerCase() === 'video' ? '500px' : '600px' }}
                      title={selectedResource.title}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs">Press F11 or click Fullscreen for immersive viewing</span>
                    </div>
                    <a
                      href={selectedResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:underline"
                    >
                      Open in new tab
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-kaggle-light rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-kaggle-blue/20">
                      <svg className="w-12 h-12 text-kaggle-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Resource to Begin</h3>
                    <p className="text-gray-600 mb-4">Choose from the learning materials on the left</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-kaggle-light rounded text-sm text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Click any resource card to view it here
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && step?.quiz && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-card-hover max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-kaggle-blue text-white p-6 rounded-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Section Quiz</h2>
                    <p className="text-white/80 text-sm mt-1">{step.title}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowQuiz(false)
                      setQuizSubmitted(false)
                      setQuizAnswers({})
                      setQuizScore(0)
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {quizSubmitted ? (
                  <div className="text-center py-8">
                    <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 ${
                      quizScore >= 70 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-5xl font-bold ${
                        quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizScore}%
                      </span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      quizScore >= 70 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {quizScore >= 70 ? '🎉 Great Job!' : '📚 Keep Learning!'}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {quizScore >= 70
                        ? 'You passed! You can move to the next section.'
                        : 'Review the materials and try again to pass this section.'}
                    </p>

                    {/* Show explanations */}
                    <div className="text-left space-y-4 mb-8">
                      {step.quiz.map((q, idx) => {
                        const userAnswer = quizAnswers[idx]
                        const isCorrect = userAnswer === q.correctAnswer
                        return (
                          <div key={idx} className={`p-4 rounded-xl border-2 ${
                            isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                          }`}>
                            <div className="flex items-start gap-3 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCorrect ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {isCorrect ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  )}
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 mb-2">{q.question}</p>
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Your answer:</span>{' '}
                                  {q.options[userAnswer] || 'Not answered'}
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-gray-700 mt-1">
                                    <span className="font-medium">Correct answer:</span>{' '}
                                    {q.options[q.correctAnswer]}
                                  </p>
                                )}
                                {q.explanation && (
                                  <p className="text-sm text-gray-600 mt-2 italic">
                                    💡 {q.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setQuizSubmitted(false)
                          setQuizAnswers({})
                          setQuizScore(0)
                        }}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded font-semibold transition-all"
                      >
                        Retake Quiz
                      </button>
                      {quizScore >= 70 && (
                        <button
                          onClick={handleNextStep}
                          className="flex-1 px-6 py-3 bg-kaggle-blue text-white rounded font-semibold hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
                        >
                          Next Section
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {step.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="bg-gray-50 rounded p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 bg-kaggle-blue rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{qIdx + 1}</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg flex-1">{q.question}</p>
                        </div>
                        <div className="space-y-2 ml-11">
                          {q.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                              className={`w-full text-left p-4 rounded border-2 transition-all ${
                                quizAnswers[qIdx] === optIdx
                                  ? 'bg-kaggle-light border-kaggle-blue shadow-card'
                                  : 'bg-white border-gray-200 hover:border-kaggle-blue hover:bg-kaggle-light/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  quizAnswers[qIdx] === optIdx
                                    ? 'border-purple-500 bg-purple-500'
                                    : 'border-gray-300'
                                }`}>
                                  {quizAnswers[qIdx] === optIdx && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  )}
                                </div>
                                <span className="text-gray-900">{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== step.quiz.length}
                      className="w-full bg-kaggle-blue text-white py-4 rounded font-bold text-lg hover:shadow-card-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Quiz
                    </button>
                    {Object.keys(quizAnswers).length !== step.quiz.length && (
                      <p className="text-center text-sm text-gray-500">
                        Please answer all questions before submitting
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Showcase - Removed, now on separate page */}
        {false && ((isLastStep && roadmap?.projects) || (completedSteps.size >= (roadmap?.steps.length || 0) && roadmap?.projects)) && (
          <div id="projects-section" className="mt-12 bg-white rounded p-8 shadow-card border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-kaggle-blue rounded-full mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-kaggle-navy mb-2">
                🎉 {completedSteps.size >= (roadmap?.steps.length || 0) ? 'Congratulations! Roadmap Completed!' : 'Ready for Projects?'}
              </h2>
              <p className="text-gray-700 text-lg">
                {completedSteps.size >= (roadmap?.steps.length || 0) 
                  ? "You've completed the entire roadmap! Now it's time to build real projects."
                  : "You've reached the final section! Here are some projects to apply your skills."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmap?.projects?.map((project, idx) => (
                <div key={idx} className="bg-white rounded p-6 shadow-card hover:shadow-card-hover transition-all border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{project.duration}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Skills you'll use:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Tasks:</p>
                    <ul className="space-y-1">
                      {project.tasks.slice(0, 3).map((task, tIdx) => (
                        <li key={tIdx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="flex-1">{task}</span>
                        </li>
                      ))}
                      {project.tasks.length > 3 && (
                        <li className="text-sm text-gray-500 italic">
                          +{project.tasks.length - 3} more tasks...
                        </li>
                      )}
                    </ul>
                  </div>

                  <button className="mt-4 w-full bg-kaggle-blue text-white py-2.5 rounded font-semibold hover:shadow-card-hover transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Start Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <FloatingChatWidget />
      </main>
    </>
  )
}
