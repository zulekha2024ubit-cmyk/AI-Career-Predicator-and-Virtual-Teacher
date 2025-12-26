"use client"
import React from 'react'
import { Button } from './Button'

type Props = {
  onOpenLogin: () => void
  onOpenSignup: () => void
}

export const Navbar: React.FC<Props> = ({ onOpenLogin, onOpenSignup }) => {
  return (
    <nav className="absolute left-0 right-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-lg font-semibold">
          <span className="rounded bg-white/70 px-2 py-1 shadow-sm">AI careerPath</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onOpenSignup}>
            Sign up
          </Button>
          <Button onClick={onOpenLogin}>Login</Button>
        </div>
      </div>
    </nav>
  )
}
