import fs from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'
import { AppNavbar } from '@/components/AppNavbar'

type Props = { params: Promise<{ slug: string }> }

export default async function RoadmapPage({ params }: Props) {
  const { slug } = await params
  const file = path.join(process.cwd(), 'public', 'roadmaps', `${slug}.json`)
  let data: any = null
  try {
    const raw = await fs.readFile(file, 'utf-8')
    data = JSON.parse(raw)
  } catch (error) {
    console.error('Failed to load roadmap:', error)
  }

  const title = data?.title ?? slug.replace(/-/g, ' ')

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-kaggle-light">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-kaggle-navy mb-3 capitalize">
              {title}
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {data?.summary ?? 'A comprehensive guide to help you master this career path step by step'}
            </p>
          </div>

          {/* Roadmap Content */}
          <div className="bg-white rounded p-6 shadow-card border border-gray-200">
            {data?.steps ? (
              <>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-kaggle-navy mb-1">Learning Path</h2>
                  <p className="text-sm text-gray-600">Follow these steps to build your expertise from beginner to advanced</p>
                </div>
                
                <div className="space-y-3">
                  {data.steps.map((s: any, index: number) => (
                    <div 
                      key={s.id}
                      className="flex gap-3 p-4 bg-kaggle-light rounded border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 bg-kaggle-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-kaggle-navy mb-1">{s.title}</h3>
                        <p className="text-sm text-gray-600">{s.description}</p>
                      </div>

                      {/* Checkmark Icon */}
                      <div className="flex-shrink-0 self-center">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-kaggle-navy text-sm">Ready to Start?</p>
                        <p className="text-xs text-gray-600">Begin your learning journey today</p>
                      </div>
                    </div>
                    <Link 
                      href={`/learn/${slug}?step=0`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-kaggle-blue text-white text-sm font-semibold rounded hover:bg-[#1BA8E0] transition-colors"
                    >
                      Start Learning Journey
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-3 text-sm">Roadmap content is being prepared</p>
              <Link href="/careers" className="text-kaggle-blue hover:text-[#1BA8E0] font-medium text-sm">
                ← Back to Careers
              </Link>
            </div>
          )}
        </div>

        {/* Back to Careers Link */}
        <div className="mt-6 text-center">
          <Link 
            href="/careers" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-kaggle-blue font-medium transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Careers
          </Link>
        </div>
      </div>
      </main>
    </>
  )
}
