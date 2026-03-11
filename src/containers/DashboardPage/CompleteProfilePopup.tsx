'use client'

import React, { useState } from 'react'
import { C } from '@/styles/colours'

type Props = {
  email: string
  first: string
  last: string
  onDismiss: () => void
}

export default function CompleteProfilePopup({ email, first, last, onDismiss }: Props) {
  const [occupation, setOccupation] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!occupation.trim()) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/user/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first, last, occupation: occupation.trim() }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(json?.error ?? 'Failed to save. Please try again.')
        return
      }

      onDismiss()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  return (
    // Backdrop
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(43, 58, 46, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Dialog */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          padding: 32,
          width: 420,
          maxWidth: 'calc(100vw - 40px)',
          boxShadow: '0 8px 32px rgba(43,58,46,0.18)',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
            fontSize: 22,
            fontWeight: 700,
            color: C.forest,
            marginBottom: 8,
          }}
        >
          Complete your profile
        </h2>
        <p style={{ fontSize: 14, color: C.stone, marginBottom: 24, lineHeight: 1.6 }}>
          Adding your occupation helps us give you more accurate VAT reclaim guidance.
        </p>

        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: C.forest,
            marginBottom: 6,
          }}
        >
          Occupation
        </label>
        <input
          autoFocus
          value={occupation}
          onChange={(e) => {
            setError(null)
            setOccupation(e.target.value)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="e.g. Freelance Contractor"
          style={{
            width: '100%',
            padding: '9px 12px',
            fontSize: 14,
            fontFamily: 'Manrope, sans-serif',
            color: C.forest,
            background: C.parchment,
            border: `1px solid ${C.bark}`,
            borderRadius: 8,
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: error ? 8 : 24,
          }}
        />

        {error && (
          <p style={{ fontSize: 13, color: C.error, marginBottom: 16 }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onDismiss}
            style={{
              padding: '9px 18px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Manrope, sans-serif',
              background: 'transparent',
              color: C.stone,
              border: `1px solid ${C.bark}`,
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !occupation.trim()}
            style={{
              padding: '9px 24px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Manrope, sans-serif',
              background: saving || !occupation.trim() ? C.lichen : C.fern,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: saving || !occupation.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}