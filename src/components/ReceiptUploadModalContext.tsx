'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import ReceiptUploader from '@/components/ReceiptUploader/ReceiptUploader'

// ─── Context ──────────────────────────────────────────────────────────────────

type ModalContextValue = {
  openModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function useReceiptUploadModal() {
  const ctx = useContext(ModalContext)
  if (!ctx)
    throw new Error(
      'useReceiptUploadModal must be used within ReceiptUploadModalProvider',
    )
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ReceiptUploadModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeModal])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Upload a receipt"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(43,58,46,0.45)' }}
            onClick={closeModal}
          />

          {/* Panel */}
          <div
            className="relative z-10 w-full rounded-t-2xl p-4 pb-8 sm:max-w-lg sm:rounded-2xl sm:p-6"
            style={{ backgroundColor: '#FAF8F3' }}
          >
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
              {/* Drag handle (mobile) */}
              <div
                className="absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full sm:hidden"
                style={{ backgroundColor: '#E0DAD0' }}
              />

              <h2
                className="text-base font-bold"
                style={{ color: '#2B3A2E', fontFamily: 'Manrope, sans-serif' }}
              >
                Upload a receipt
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-100"
                style={{ backgroundColor: '#F0EDE6', color: '#7A8A7E' }}
                aria-label="Close"
              >
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* The uploader — rendered without its own outer card styling */}
            <ReceiptUploader />
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}
