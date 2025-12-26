"use client"
import React from 'react'
import cn from 'classnames'
import Link from 'next/link'

type BaseProps = {
  variant?: 'primary' | 'outline' | 'ghost'
  href?: string
  asChild?: boolean // future extension (e.g., for Radix Slot) not used yet
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', children, href, asChild, ...rest }) => {
  const styles: Record<'primary' | 'outline' | 'ghost', string> = {
    primary: 'btn',
    outline:
      'inline-flex items-center justify-center rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-kaggle-blue hover:text-kaggle-blue transition-colors',
    ghost: 'inline-flex items-center justify-center rounded px-3 py-2 text-sm hover:bg-gray-100 transition-colors'
  }

  const cls = cn(styles[variant], className)

  if (href) {
    return (
      <Link href={href as any} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
