"use client"
import React from 'react'
import { Button } from './Button'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="card max-w-lg text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              ⚠️ Something went wrong
            </h1>
            <p className="text-gray-700 mb-4">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Error details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              <Button variant="outline" href="/">
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
