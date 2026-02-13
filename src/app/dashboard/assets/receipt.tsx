export function ReceiptIllustration() {
  return (
    <div className="relative h-32 w-32">
      <div className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/30" />

      <svg
        viewBox="0 0 120 120"
        className="absolute top-6 left-6 h-24 w-24 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Back receipt */}
        <rect
          x="28"
          y="18"
          width="48"
          height="64"
          rx="4"
          className="opacity-40"
        />

        {/* Middle receipt */}
        <rect
          x="22"
          y="24"
          width="48"
          height="64"
          rx="4"
          className="opacity-70"
        />

        {/* Front receipt */}
        <rect x="16" y="30" width="48" height="64" rx="4" />

        {/* Receipt lines */}
        <line x1="24" y1="44" x2="56" y2="44" />
        <line x1="24" y1="52" x2="50" y2="52" />
        <line x1="24" y1="60" x2="56" y2="60" />
      </svg>
    </div>
  )
}
