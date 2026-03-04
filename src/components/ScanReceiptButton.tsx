'use client'

import { useReceiptUploadModal } from '@/components/ReceiptUploadModalContext'

/**
 * Responsive "Scan a receipt" button for use anywhere on the page.
 * - Mobile:  shows a green "+" icon button
 * - Desktop: shows a green "Scan a receipt" text button
 *
 * Opens the global receipt upload modal via context.
 */
export default function ScanReceiptButton() {
  const { openModal } = useReceiptUploadModal()

  return (
    <button
      type="button"
      onClick={openModal}
      className="flex flex-shrink-0 items-center justify-center gap-2 rounded-xl font-semibold text-white transition-colors duration-150"
      style={{ backgroundColor: '#3E6B52' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#35604A'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#3E6B52'
      }}
      aria-label="Scan a receipt"
    >
      {/* Mobile: icon only */}
      <span className="flex h-10 w-10 items-center justify-center sm:hidden">
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>

      {/* Desktop: icon + label */}
      <span className="hidden items-center gap-2 px-4 py-2.5 text-sm sm:flex">
        <svg
          width="15"
          height="15"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Scan a receipt
      </span>
    </button>
  )
}
