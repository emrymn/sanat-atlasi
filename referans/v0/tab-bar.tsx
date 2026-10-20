'use client'

import { ChartNoAxesColumn, Landmark, Layers, Sunrise } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAtlas, type Tab } from './atlas-context'

const tabs: { id: Tab; label: string; icon: typeof Sunrise }[] = [
  { id: 'today', label: 'Bugün', icon: Sunrise },
  { id: 'browse', label: 'Göz At', icon: Landmark },
  { id: 'review', label: 'Pekiştir', icon: Layers },
  { id: 'progress', label: 'İlerleme', icon: ChartNoAxesColumn },
]

export function TabBar() {
  const { tab, goTab } = useAtlas()
  return (
    <nav
      aria-label="Ana gezinme"
      className="relative z-20 border-t border-hairline bg-paper/90 pb-[var(--safe-bottom)] backdrop-blur-md transition-colors duration-300"
    >
      <ul className="flex h-[58px] items-stretch">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => goTab(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex size-full flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4',
                  active ? 'text-gold' : 'text-ink-2 hover:text-ink',
                )}
              >
                <Icon className="size-[22px]" strokeWidth={active ? 1.6 : 1.25} />
                <span className="font-sans text-[10.5px] font-medium tracking-[0.04em]">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
