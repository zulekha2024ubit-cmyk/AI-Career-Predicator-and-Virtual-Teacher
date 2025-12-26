"use client"
import React, { useState, KeyboardEvent } from 'react'

type Props = {
  label?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export const MultiTagInput: React.FC<Props> = ({ label, values, onChange, placeholder }) => {
  const [draft, setDraft] = useState('')

  const add = (val: string) => {
    const v = val.trim()
    if (!v) return
    if (values.includes(v)) return
    onChange([...values, v])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1))
    }
  }

  const remove = (idx: number) => {
    const next = values.slice()
    next.splice(idx, 1)
    onChange(next)
  }

  return (
    <label className="block w-full">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {values.map((v, i) => (
          <span key={v} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm">
            {v}
            <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => remove(i)} aria-label={`Remove ${v}`}>
              ×
            </button>
          </span>
        ))}
        <input
          className="flex-1 border-none p-0 outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? 'Type and press Enter'}
        />
      </div>
    </label>
  )
}
