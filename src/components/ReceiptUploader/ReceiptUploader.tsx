'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  createUploadUrlClient,
  guessContentType,
  guessFileType,
} from '@/components/ReceiptUploader/utils'

export default function ReceiptUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Revoke object URL on unmount / change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFile = (f: File | null) => {
    setFile(f)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(
      f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    )
  }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(null)
    handleFile(e.target.files?.[0] ?? null)
  }

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    setSuccess(null)
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  const clearSelection = () => {
    setFile(null)
    setPreviewUrl(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  // ── Upload ─────────────────────────────────────────────────────────────────

  const upload = async () => {
    if (!file) {
      setError('Please choose a file first.')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const contentType = guessContentType(file)
      const filename = 'original.' + guessFileType(file)

      const createResult = await createUploadUrlClient({
        filename,
        contentType,
      })
      if (!createResult.ok) throw new Error(createResult.message)

      const putRes = await fetch(createResult.data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      })

      if (!putRes.ok) {
        const text = await putRes.text().catch(() => '')
        throw new Error(
          `Upload failed (${putRes.status}).${text ? ' ' + text.slice(0, 200) : ''}`,
        )
      }

      setSuccess("Receipt uploaded. We'll extract the VAT for you.")
      clearSelection()
    } catch (e: any) {
      setError(
        e?.message ??
          "We couldn't upload that receipt. Check your connection and try again.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Drop zone */}
      <label
        className={[
          'flex cursor-pointer rounded-xl border px-5 text-center transition-colors duration-150',
          file
            ? 'flex-row items-center gap-3 py-4'
            : 'flex-col items-center justify-center gap-2 py-7',
          isDragging ? 'border-solid' : 'border-dashed',
        ].join(' ')}
        style={{
          borderColor: file || isDragging ? '#6AAF7B' : '#E0DAD0',
          backgroundColor: isDragging
            ? '#C4DCBE'
            : file
              ? 'rgba(196,220,190,0.2)'
              : 'transparent',
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={onPickFile}
          disabled={isUploading}
        />

        {file ? (
          /* ── File selected ── */
          <>
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: '#C4DCBE' }}
            >
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#3E6B52"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p
                className="truncate text-sm font-semibold"
                style={{ color: '#2B3A2E' }}
              >
                {file.name}
              </p>
              <p className="text-xs" style={{ color: '#7A8A7E' }}>
                {Math.round(file.size / 1024)} KB
              </p>
            </div>
            <button
              type="button"
              className="flex flex-shrink-0 items-center justify-center rounded-lg p-1.5 transition-colors duration-100 hover:bg-red-50"
              style={{ color: '#7A8A7E' }}
              onClick={(e) => {
                e.preventDefault()
                clearSelection()
              }}
              aria-label="Remove file"
            >
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        ) : (
          /* ── Empty state ── */
          <>
            <div
              className="mb-1 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150"
              style={{ backgroundColor: isDragging ? '#b0d4aa' : '#C4DCBE' }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#3E6B52"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#2B3A2E' }}>
              Drop your receipt here, or{' '}
              <span
                className="underline underline-offset-2"
                style={{ color: '#3E6B52' }}
              >
                browse
              </span>
            </p>
            <p className="text-xs" style={{ color: '#7A8A7E' }}>
              JPG, PNG or PDF · up to 10 MB
            </p>
          </>
        )}
      </label>

      {/* Image preview */}
      {previewUrl && (
        <div
          className="mt-3 overflow-hidden rounded-xl border bg-white"
          style={{ borderColor: '#E0DAD0' }}
        >
          <img
            src={previewUrl}
            alt="Receipt preview"
            className="block h-auto max-h-48 w-full object-contain"
          />
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={upload}
        disabled={!file || isUploading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: '#3E6B52' }}
        onMouseEnter={(e) => {
          if (!isUploading && file)
            e.currentTarget.style.backgroundColor = '#35604A'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3E6B52'
        }}
      >
        {isUploading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Uploading…
          </>
        ) : (
          <>
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
            Upload receipt
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl border p-3 text-sm leading-relaxed font-medium"
          style={{
            backgroundColor: 'rgba(196,90,74,0.08)',
            borderColor: 'rgba(196,90,74,0.2)',
            color: '#C45A4A',
          }}
        >
          <svg
            className="mt-0.5 flex-shrink-0"
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl border p-3 text-sm leading-relaxed font-medium"
          style={{
            backgroundColor: 'rgba(61,160,106,0.08)',
            borderColor: 'rgba(61,160,106,0.2)',
            color: '#2D8055',
          }}
        >
          <svg
            className="mt-0.5 flex-shrink-0"
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}

      <p className="mt-4 text-center text-xs" style={{ color: '#7A8A7E' }}>
        Accepts JPG · PNG · PDF
      </p>
    </div>
  )
}
