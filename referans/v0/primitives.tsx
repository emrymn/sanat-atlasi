'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { movementById, type MovementId } from '@/lib/atlas-data'

export function MovementBadge({ id, className }: { id: MovementId; className?: string }) {
  const m = movementById[id]
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-2 rounded-full border border-hairline bg-surface/70 pl-2.5 pr-3 font-sans text-[13px] text-ink',
        className,
      )}
    >
      <span aria-hidden className="size-2 rounded-full" style={{ background: m.color }} />
      {m.name}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('label-caps text-ink-2', className)}>{children}</p>
}

export function RuledEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px flex-1 bg-hairline" />
      <span className="label-caps text-gold">{children}</span>
      <span aria-hidden className="h-px flex-1 bg-hairline" />
    </div>
  )
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-display text-[28px] font-semibold leading-8 text-ink text-balance', className)}>
      {children}
    </h2>
  )
}

export function ReadingText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-reading text-[17px] leading-[1.6] text-ink text-pretty', className)}>{children}</p>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' }

export function AtlasButton({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 font-sans text-[15px] font-medium tracking-[0.01em] transition-[background-color,transform,opacity,border-color] duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50',
        variant === 'primary' && 'bg-ink text-paper shadow-[var(--shadow-card)] hover:bg-ink/90',
        variant === 'secondary' && 'border border-ink/25 bg-surface text-ink hover:border-ink/50',
        variant === 'quiet' && 'min-h-11 text-ink-2 underline decoration-hairline underline-offset-4 hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function BackButton({ onClick, overlay }: { onClick: () => void; overlay?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Geri"
      className={cn(
        'flex size-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2',
        overlay ? 'bg-paper/80 text-ink shadow-[var(--shadow-card)] backdrop-blur-md' : 'text-ink hover:bg-surface',
      )}
    >
      <ChevronLeft className="size-6" strokeWidth={1.4} />
    </button>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-14 shrink-0 items-center justify-center focus-visible:outline-2"
    >
      <span
        className={cn(
  'box-border flex h-[26px] w-[44px] shrink-0 items-center rounded-full border p-[2px] transition-colors duration-200',
  checked ? 'border-gold bg-gold' : 'border-hairline bg-surface',
  )}
  >
  <span
  aria-hidden
  className={cn(
  'block size-5 shrink-0 rounded-full shadow-sm transition-transform duration-200',
  checked ? 'translate-x-[16px] bg-on-gold' : 'translate-x-0 bg-ink-2/60',
  )}
  />
      </span>
    </button>
  )
}
