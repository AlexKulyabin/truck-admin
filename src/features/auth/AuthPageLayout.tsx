import type { PropsWithChildren } from 'react'
import { AuthMapBackground } from './AuthMapBackground'

export function AuthPageLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen overflow-hidden bg-surface">
      <div className="[grid-area:1/1]">
        <AuthMapBackground />
      </div>

      <div className="z-10 flex min-h-screen items-center justify-center px-4 py-8 [grid-area:1/1] sm:px-6">
        {children}
      </div>
    </main>
  )
}
