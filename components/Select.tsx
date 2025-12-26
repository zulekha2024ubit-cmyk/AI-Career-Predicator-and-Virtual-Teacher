"use client"
import React from 'react'

type Option = { value: string; label: string }

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: Option[]
}

export const Select: React.FC<Props> = ({ label, error, options, ...rest }) => {
  return (
    <label className="block w-full">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <select className="input" {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}
