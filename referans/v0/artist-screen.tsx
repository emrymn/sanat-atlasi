'use client'

import { artistById, movementById } from '@/lib/atlas-data'
import { ArtImage, FramedArtwork, WallLabel } from '../artwork'
import { BackButton, Eyebrow, MovementBadge, ReadingText, SectionTitle } from '../primitives'
import { useAtlas } from '../atlas-context'

export function ArtistScreen({ artistId }: { artistId: string }) {
  const { pop, openViewer } = useAtlas()
  const artist = artistById[artistId]
  const movement = movementById[artist.movement]

  return (
    <div className="no-scrollbar relative h-full overflow-y-auto pb-12">
      <div className="absolute left-3 top-[calc(var(--safe-top)+4px)] z-20">
        <BackButton onClick={pop} overlay />
      </div>

      <div className="relative h-[300px] w-full">
        <ArtImage work={artist.works[0]} color={movement.color} width={1000} eager />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-paper" />
      </div>

      <header className="relative -mt-8 px-5">
        <h1 className="font-display text-[36px] font-semibold leading-[1.05] text-ink text-balance">{artist.name}</h1>
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <span className="font-reading text-[15px] text-ink-2">{artist.years}</span>
          <MovementBadge id={artist.movement} />
          {!artist.course && (
            <span className="rounded-full border border-hairline px-2 py-px font-sans text-[10.5px] text-ink-2">
              kurs dışı
            </span>
          )}
        </div>
      </header>

      <section className="mt-8 px-5">
        <Eyebrow>Notlarımdan</Eyebrow>
        <ReadingText className="mt-2 italic">{artist.note}</ReadingText>
      </section>

      <section className="mt-7 px-5">
        <div className="rounded-r-lg border-l-[3px] bg-surface px-5 py-4" style={{ borderLeftColor: movement.color }}>
          <p className="font-display text-[20px] font-semibold leading-6 text-ink">Nasıl tanırım?</p>
          <ReadingText className="mt-1.5 text-[16px]">{artist.tip}</ReadingText>
        </div>
      </section>

      <section className="mt-10 px-5">
        <SectionTitle>Eserleri</SectionTitle>
        <div className="mt-5 columns-2 gap-4">
          {artist.works.map((w, i) => (
            <button
              key={w.file}
              type="button"
              onClick={() => openViewer(artist.id, i)}
              className="mb-6 block w-full break-inside-avoid text-left focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <FramedArtwork work={w} color={movement.color} matPad={8} imageWidth={500} />
              <WallLabel work={w} size="sm" className="mt-3" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
