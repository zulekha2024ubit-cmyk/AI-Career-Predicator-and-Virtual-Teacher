"use client"
import React, { useEffect } from 'react'
import cn from 'classnames'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  preventClose?: boolean
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, preventClose = false }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, preventClose])

  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={preventClose ? undefined : onClose} 
      />
      <div className={cn('relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-card max-h-[90vh] overflow-y-auto')}>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
            {!preventClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
