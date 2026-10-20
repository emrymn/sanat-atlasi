'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { commonsUrl, type Work } from '@/lib/atlas-data'

type ArtImageProps = {
  work: Work
  color: string
  width?: number
  alt?: string
  className?: string
  fit?: 'cover' | 'contain'
  eager?: boolean
}

export function ArtImage({ work, color, width = 800, alt, className, fit = 'cover', eager }: ArtImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const ref = useRef<HTMLImageElement>(null)

  // Images can finish (or fail) before hydration attaches handlers.
  useEffect(() => {
    const img = ref.current
    if (img?.complete) setState(img.naturalWidth > 0 ? 'loaded' : 'error')
  }, [])

  return (
    <div
      className={cn('absolute inset-0', className)}
      style={{ background: `color-mix(in oklab, ${color} 42%, var(--mat))` }}
    >
      {state !== 'error' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={commonsUrl(work.file, width) || '/placeholder.svg'}
          alt={alt ?? work.title}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={cn(
            'size-full transition-opacity duration-500 ease-out select-none',
            fit === 'cover' ? 'object-cover' : 'object-contain',
            state === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {state === 'error' && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, transparent 0 9px, ${color} 9px 10px)`,
          }}
        />
      )}
    </div>
  )
}

type FramedArtworkProps = {
  work: Work
  color: string
  fitHeight?: number
  aspect?: number
  matPad?: number
  imageWidth?: number
  className?: string
  eager?: boolean
  alt?: string
}

export function FramedArtwork({
  work,
  color,
  fitHeight,
  aspect,
  matPad = 14,
  imageWidth = 800,
  className,
  eager,
  alt,
}: FramedArtworkProps) {
  const ratio = aspect ?? work.aspect
  const chrome = 2 * (matPad + 2)
  const frameStyle: CSSProperties | undefined = fitHeight
    ? { width: `min(100%, ${Math.round(fitHeight * ratio + chrome)}px)` }
    : undefined

  return (
    <div className={cn('art-frame', className)} style={frameStyle}>
      <div className="art-mat" style={{ '--mat-pad': `${matPad}px` } as CSSProperties}>
        <div className="art-window" style={{ aspectRatio: ratio }}>
          <ArtImage work={work} color={color} width={imageWidth} eager={eager} alt={alt} />
        </div>
      </div>
    </div>
  )
}

export function WallLabel({
  work,
  artistName,
  className,
  size = 'md',
}: {
  work: Work
  artistName?: string
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {artistName && <p className="label-caps text-ink">{artistName}</p>}
      <p
        className={cn(
          'font-display italic font-semibold text-ink text-pretty',
          size === 'md' ? 'text-[19px] leading-6' : 'text-[16px] leading-5',
        )}
      >
        {work.title}
      </p>
      <p className="label-caps text-ink-2 !text-[10.5px]">
        {work.year} · {work.museum}
      </p>
    </div>
  )
}
