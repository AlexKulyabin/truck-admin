import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition',
        'bg-map-marker text-white hover:bg-map-marker-dark',
        'focus:outline-none focus:ring-2 focus:ring-map-marker/30',
        className,
      )}
      type={type}
      {...props}
    />
  )
}
