"use client"
import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export const Input: React.FC<Props> = ({ label, error, ...rest }) => {
  return (
    <label className="block w-full">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <input className="input" {...rest} />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}
