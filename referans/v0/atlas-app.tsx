'use client'

import { useCallback, useMemo, useState } from 'react'
import { BatteryFull, Signal, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dailyRotation, initialTopics, movementById, type MovementId } from '@/lib/atlas-data'
import { AtlasContext, type QuizMode, type Route, type Tab, type Theme } from './atlas-context'
import { TabBar } from './tab-bar'
import { TodayScreen } from './screens/today-screen'
import { DailyArtistScreen } from './screens/daily-artist-screen'
import { BrowseScreen } from './screens/browse-screen'
import { MovementScreen } from './screens/movement-screen'
import { ArtistScreen } from './screens/artist-screen'
import { QuizScreen } from './screens/quiz-screen'
import { ProgressScreen } from './screens/progress-screen'
import { SettingsSheet } from './settings-sheet'
import { ArtworkViewer } from './artwork-viewer'

export function AtlasApp() {
  const [tab, setTab] = useState<Tab>('today')
  const [stack, setStack] = useState<Route[]>([])
  const [theme, setTheme] = useState<Theme>('sepia')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [viewer, setViewer] = useState<{ artistId: string; index: number } | null>(null)
  const [dailyIndex, setDailyIndex] = useState(0)
  const [reviewIds, setReviewIds] = useState<string[]>([])
  const [topics, setTopics] = useState(initialTopics)
  const [quizMode, setQuizMode] = useState<QuizMode>({ kind: 'mixed' })
  const [quizSession, setQuizSession] = useState(0)

  const goTab = useCallback((next: Tab) => {
    setStack([])
    setTab(next)
  }, [])

  const isUnlocked = useCallback(
    (id: MovementId) => {
      const topic = movementById[id].unlockTopic
      return topic === null || topics.some((t) => t.n === topic && t.done)
    },
    [topics],
  )

  const value = useMemo(
    () => ({
      tab,
      theme,
      dailyArtistId: dailyRotation[dailyIndex],
      reviewIds,
      topics,
      quizMode,
      quizSession,
      goTab,
      push: (route: Route) => setStack((s) => [...s, route]),
      pop: () => setStack((s) => s.slice(0, -1)),
      openViewer: (artistId: string, index: number) => setViewer({ artistId, index }),
      openSettings: () => setSettingsOpen(true),
      setTheme,
      nextDaily: () => setDailyIndex((i) => (i + 1) % dailyRotation.length),
      toggleReview: (id: string) =>
        setReviewIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
      toggleTopic: (n: number) => setTopics((ts) => ts.map((t) => (t.n === n ? { ...t, done: !t.done } : t))),
      startQuiz: (mode: QuizMode) => {
        setQuizMode(mode)
        setQuizSession((s) => s + 1)
        goTab('review')
      },
      isUnlocked,
    }),
    [tab, theme, dailyIndex, reviewIds, topics, quizMode, quizSession, goTab, isUnlocked],
  )

  const top = stack[stack.length - 1]

  return (
    <AtlasContext.Provider value={value}>
      <div className={cn(theme === 'evening' && 'dark')}>
        <div className="flex min-h-dvh items-center justify-center bg-backdrop transition-colors duration-300 md:py-10">
          <div
            className={cn(
              'device paper-grain relative isolate h-dvh w-full overflow-hidden bg-paper text-ink transition-colors duration-300',
              'md:h-[844px] md:w-[390px] md:rounded-[52px] md:shadow-[0_0_0_10px_#15110e,0_0_0_11px_#3a332c,0_40px_80px_-20px_rgb(0_0_0/0.5)]',
            )}
          >
            <StatusBar />

            <div className="absolute inset-0 flex flex-col">
              <main className="relative min-h-0 flex-1">
                <div key={tab} className="anim-fade absolute inset-0">
                  {tab === 'today' && <TodayScreen />}
                  {tab === 'browse' && <BrowseScreen />}
                  {tab === 'review' && <QuizScreen key={quizSession} />}
                  {tab === 'progress' && <ProgressScreen />}
                </div>

                {top && (
                  <div
                    key={`${stack.length}-${JSON.stringify(top)}`}
                    className="anim-push absolute inset-0 z-10 bg-paper shadow-[-12px_0_24px_-12px_rgb(0_0_0/0.25)]"
                  >
                    {top.type === 'daily' && <DailyArtistScreen />}
                    {top.type === 'artist' && <ArtistScreen artistId={top.id} />}
                    {top.type === 'movement' && <MovementScreen movementId={top.id} />}
                  </div>
                )}
              </main>
              <TabBar />
            </div>

            {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
            {viewer && (
              <ArtworkViewer
                artistId={viewer.artistId}
                startIndex={viewer.index}
                onClose={() => setViewer(null)}
              />
            )}

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-1/2 z-[70] hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ink/80 md:block"
            />
          </div>
        </div>
      </div>
    </AtlasContext.Provider>
  )
}

function StatusBar() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[55] hidden h-[47px] items-center bg-gradient-to-b from-paper via-paper/85 to-transparent transition-colors duration-300 justify-between px-8 pt-1 font-sans text-[15px] font-semibold text-ink md:flex"
    >
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal className="size-4" strokeWidth={2} />
        <Wifi className="size-4" strokeWidth={2} />
        <BatteryFull className="size-5" strokeWidth={1.6} />
      </span>
    </div>
  )
}
