export function AIChatIllustration() {
  return (
    <div className="relative h-32 w-32">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/30" />

      <svg
        viewBox="0 0 120 120"
        className="absolute top-6 left-6 h-24 w-24 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Back chat bubble */}
        <rect
          x="30"
          y="20"
          width="56"
          height="36"
          rx="8"
          className="opacity-40"
        />
        <path d="M40 56l-6 8 14-6" className="opacity-40" />

        {/* Front chat bubble */}
        <rect x="18" y="36" width="56" height="36" rx="8" />
        <path d="M28 72l-6 10 18-8" />

        {/* Text lines */}
        <line x1="28" y1="48" x2="60" y2="48" />
        <line x1="28" y1="56" x2="54" y2="56" />
      </svg>
    </div>
  )
}
