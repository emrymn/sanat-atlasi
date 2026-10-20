'use client'

import { Check, Plus } from 'lucide-react'
import { artistById, movementById, neighbours, type MovementId } from '@/lib/atlas-data'
import { ArtImage, FramedArtwork, WallLabel } from '../artwork'
import { AtlasButton, BackButton, Eyebrow, MovementBadge, ReadingText, SectionTitle } from '../primitives'
import { useAtlas } from '../atlas-context'

export function DailyArtistScreen() {
  const { dailyArtistId, pop, nextDaily, reviewIds, toggleReview, openViewer } = useAtlas()
  const artist = artistById[dailyArtistId]
  const movement = movementById[artist.movement]
  const added = reviewIds.includes(artist.id)

  return (
    <div key={artist.id} className="no-scrollbar anim-fade relative h-full overflow-y-auto pb-12">
      <div className="absolute left-3 top-[calc(var(--safe-top)+4px)] z-20">
        <BackButton onClick={pop} overlay />
      </div>

      <div className="relative h-[430px] w-full">
        <ArtImage work={artist.works[0]} color={movement.color} width={1200} eager />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-paper/70 to-paper"
        />
      </div>

      <header className="relative -mt-14 px-5">
        <h1 className="font-display text-[44px] font-semibold leading-[1] text-ink text-balance">{artist.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="font-reading text-[16px] text-ink-2">{artist.years}</span>
          <MovementBadge id={artist.movement} />
        </div>
        <p className="mt-4 flex items-center gap-2">
          <span aria-hidden className="h-px w-5 bg-gold" />
          <span className="label-caps text-gold">{artist.course ? `Kursta: Konu ${artist.course}` : 'Kurs dışı'}</span>
        </p>
      </header>

      <section className="mt-10 px-5">
        <SectionTitle>Hayatı</SectionTitle>
        <div className="mt-3 flex flex-col gap-4">
          {artist.bio.map((p) => (
            <ReadingText key={p.slice(0, 16)}>{p}</ReadingText>
          ))}
        </div>
        <p className="mt-3 font-sans text-[12px] text-ink-2">Kaynak: Vikipedi</p>
      </section>

      <section className="mt-10 px-5">
        <div
          className="rounded-r-lg border-l-[3px] bg-surface p-5 shadow-[var(--shadow-card)]"
          style={{ borderLeftColor: movement.color }}
        >
          <SectionTitle className="text-[24px] leading-7">Dönemi · {movement.name}</SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            {movement.about.map((p) => (
              <ReadingText key={p.slice(0, 16)} className="text-[16px]">
                {p}
              </ReadingText>
            ))}
          </div>
          <MovementTimeline id={movement.id} />
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle className="px-5">Eserleri</SectionTitle>
        <ul className="no-scrollbar mt-5 flex snap-x snap-mandatory items-start gap-5 overflow-x-auto px-5 pb-6">
          {artist.works.map((w, i) => {
            const ratio = Math.min(w.aspect, 1.45)
            const h = Math.round(Math.min(230, 260 / ratio))
            return (
              <li key={w.file} className="shrink-0 snap-center">
                <button
                  type="button"
                  onClick={() => openViewer(artist.id, i)}
                  className="block text-left focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ width: Math.round(h * ratio + 32) }}
                >
                  <FramedArtwork work={w} color={movement.color} fitHeight={h} aspect={ratio} />
                  <WallLabel work={w} className="mt-4" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-4 flex flex-col gap-2 px-5">
        <AtlasButton
          variant={added ? 'secondary' : 'primary'}
          onClick={() => toggleReview(artist.id)}
          aria-pressed={added}
        >
          {added ? (
            <>
              <Check className="size-4" strokeWidth={1.6} /> Pekiştirmeye eklendi
            </>
          ) : (
            <>
              <Plus className="size-4" strokeWidth={1.6} /> Bu sanatçıyı pekiştirmeye ekle
            </>
          )}
        </AtlasButton>
        <AtlasButton variant="quiet" onClick={nextDaily}>
          Başka bir sanatçı
        </AtlasButton>
      </section>
    </div>
  )
}

export function MovementTimeline({ id }: { id: MovementId }) {
  const { prev, next } = neighbours(id)
  const current = movementById[id]
  return (
    <div className="mt-6" aria-label="Akım zaman çizelgesi">
      <div className="flex items-center gap-1.5">
        <span className="h-[3px] flex-1 rounded-full opacity-45" style={{ background: prev?.color ?? 'var(--hairline)' }} />
        <span className="relative h-[7px] flex-[1.4] rounded-full" style={{ background: current.color }}>
          <span
            aria-hidden
            className="absolute -top-[5px] left-1/2 size-[17px] -translate-x-1/2 rounded-full border-2 border-surface"
            style={{ background: current.color }}
          />
        </span>
        <span className="h-[3px] flex-1 rounded-full opacity-45" style={{ background: next?.color ?? 'var(--hairline)' }} />
      </div>
      <div className="mt-3 grid grid-cols-[1fr_1.4fr_1fr] gap-1.5 font-sans text-[11px] leading-4">
        <span className="text-ink-2">{prev ? `← ${prev.name}` : ''}</span>
        <span className="text-center font-semibold text-ink">{current.name}</span>
        <span className="text-right text-ink-2">{next ? `${next.name} →` : ''}</span>
      </div>
      <Eyebrow className="mt-2 text-center !text-[10px]">{current.century}</Eyebrow>
    </div>
  )
}
