import { cn } from '../../lib/cn'

export function Button({ className, type = 'button', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition',
        'bg-[#1f6f43] text-white hover:bg-[#185a36]',
        'focus:outline-none focus:ring-2 focus:ring-[#1f6f43]/30',
        className,
      )}
      type={type}
      {...props}
    />
  )
}
