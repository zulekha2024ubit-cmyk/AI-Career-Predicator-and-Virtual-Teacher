import React from 'react'

export const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="h-2 w-full rounded bg-gray-200">
    <div className="h-2 rounded bg-primary" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
)
