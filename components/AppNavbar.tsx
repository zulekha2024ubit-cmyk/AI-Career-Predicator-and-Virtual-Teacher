"use client"
import React from 'react'
import Link from 'next/link'
import { useAuth } from './SupabaseProvider'
import { Button } from './Button'

export const AppNavbar: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
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
          {user && (
            <>
              <Link href={"/careers" as any} className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                Careers
              </Link>
              <Link href="/predictor" className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                Predictor
              </Link>
              <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                Profile
              </Link>
              <Button variant="outline" onClick={signOut} className="text-sm border-gray-300 hover:border-kaggle-blue hover:text-kaggle-blue">
                Logout
              </Button>
            </>
          )}
          {!user && (
            <>
              <Link href={"/careers" as any} className="text-sm font-medium text-gray-700 hover:text-kaggle-blue transition">
                Explore Careers
              </Link>
              <Link href="/" className="btn btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
