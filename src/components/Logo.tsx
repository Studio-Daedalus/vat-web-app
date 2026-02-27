import React from 'react'
import clsx from 'clsx'

/**
 * Docket logo
 * Concept: receipt + check + sprout (growth + correctness) in a calm, organic mark.
 * Brand palette:
 * - Forest: #2B3A2E
 * - Fern:   #3E6B52
 * - Lichen: #C4DCBE
 * - Bark:   #E0DAD0
 * - Parchment: #FAF8F3
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {/* Mark */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-9 w-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft rounded tile */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill="#2B3A2E" />

        {/* Receipt silhouette */}
        <path
          d="M16 14.5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2V33l-2.2-1.1a1.6 1.6 0 0 0-1.4 0L26 33l-2.4-1.1a1.6 1.6 0 0 0-1.4 0L20 33l-2.2-1.1a1.6 1.6 0 0 0-1.4 0L16 33V14.5Z"
          fill="#FAF8F3"
          opacity="0.96"
        />

        {/* Receipt lines */}
        <path
          d="M19 18h10M19 21h14M19 24h12"
          stroke="#E0DAD0"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Growth + check badge */}
        <circle cx="34.2" cy="29.2" r="6.2" fill="#C4DCBE" />
        <path
          d="M31.7 29.2l1.5 1.6 3.6-4.1"
          stroke="#2B3A2E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tiny sprout accent */}
        <path
          d="M32.2 22.2c2.2-.1 3.9 1.2 4.8 3.1-1.9.2-4.3-.6-5.2-2.1-.4-.6-.2-.9.4-1Z"
          fill="#3E6B52"
          opacity="0.95"
        />
      </svg>

      {/* Wordmark */}
      {showWordmark ? (
        <span className="font-display text-2xl tracking-tight text-[#2B3A2E] select-none">
          Docket
        </span>
      ) : null}
    </div>
  )
}
