import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { SupabaseProvider } from '@/components/SupabaseProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AI Career Predictor & Learning Platform',
  description: 'AI CareerPath — Predict, learn, and grow with a virtual teacher.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="%2320BEFF"/><text x="50" y="70" font-size="45" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">AI</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'><rect width='150' height='150' rx='17' fill='%2320BEFF'/><text x='50' y='70' font-size='70' font-weight='bold' text-anchor='middle' fill='white' font-family='Time New Roman, sans-serif'>AI</text></svg>" />
      </head>
      <body className="min-h-screen bg-kaggle-light text-gray-900 antialiased flex flex-col">
        <ErrorBoundary>
          <SupabaseProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
