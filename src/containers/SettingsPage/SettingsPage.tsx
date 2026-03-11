'use client'

import React, { useState } from 'react'
import { C } from '@/styles/colours'
import { GetUserResponse } from '@/types/api'

export type SettingsPageProps = {
  user: GetUserResponse
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [form, setForm] = useState({
    email: user.email,
    first: user.first,
    last: user.last,
    occupation: user.occupation ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSaveSuccess(false)
    setSaveError(null)
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const body: Record<string, string> = {
        email: form.email,
        first: form.first,
        last: form.last,
      }
      if (form.occupation) body.occupation = form.occupation

      const res = await fetch('/api/user/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setSaveError(json?.error ?? 'Failed to save changes.')
      } else {
        setSaveSuccess(true)
      }
    } catch {
      setSaveError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    fontSize: 14,
    fontFamily: 'Manrope, sans-serif',
    color: C.forest,
    background: '#fff',
    border: `1px solid ${C.bark}`,
    borderRadius: 8,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: C.forest,
    marginBottom: 6,
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'Manrope, sans-serif',
        background: C.parchment,
      }}
    >
      <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
              fontSize: 32,
              fontWeight: 700,
              color: C.forest,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            Account Settings
          </h1>
          <p style={{ fontSize: 14, color: C.stone }}>
            Manage your personal details
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSave}
          style={{
            maxWidth: 520,
            background: '#fff',
            border: `1px solid ${C.bark}`,
            borderRadius: 12,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>First name</label>
              <input
                style={inputStyle}
                name="first"
                value={form.first}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Last name</label>
              <input
                style={inputStyle}
                name="last"
                value={form.last}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>
              Occupation{' '}
              <span style={{ fontWeight: 400, color: C.stone }}>(optional)</span>
            </label>
            <input
              style={inputStyle}
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
            />
          </div>

          {saveError && (
            <p style={{ fontSize: 13, color: C.error, margin: 0 }}>{saveError}</p>
          )}
          {saveSuccess && (
            <p style={{ fontSize: 13, color: C.success, margin: 0 }}>
              Changes saved.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '9px 24px',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'Manrope, sans-serif',
                background: saving ? C.lichen : C.fern,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
