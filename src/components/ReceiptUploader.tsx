'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

type CreateUploadUrlResponse = {
  receiptId: string
  s3Key: string
  uploadUrl: string
  uploadMethod?: string
  expiresInSecs?: number
}

function guessContentType(file: File): string {
  if (file.type) return file.type
  const name = file.name.toLowerCase()
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
  if (name.endsWith('.png')) return 'image/png'
  if (name.endsWith('.pdf')) return 'application/pdf'
  return 'application/octet-stream'
}

export default function ReceiptUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // clean up preview object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const fileLabel = useMemo(() => {
    if (!file) return 'No file selected'
    return `${file.name} (${Math.round(file.size / 1024)} KB)`
  }, [file])

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(null)

    const f = e.target.files?.[0] ?? null
    setFile(f)

    // preview
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (f && f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f))
    } else {
      setPreviewUrl(null)
    }
  }

  const clearSelection = () => {
    setFile(null)
    setPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = '' // ✅ allows selecting the same file again
    }
  }

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

      const createRes = await fetch('/api/receipts/createUploadUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType }),
      })

      const createData =
        (await createRes.json()) as Partial<CreateUploadUrlResponse> & { error?: string }

      if (!createRes.ok || !createData.uploadUrl) {
        throw new Error(createData.error ?? 'Failed to get upload URL')
      }

      const putRes = await fetch(createData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      })

      if (!putRes.ok) {
        const text = await putRes.text().catch(() => '')
        throw new Error(`Upload to S3 failed (${putRes.status}). ${text ? text.slice(0, 200) : ''}`)
      }

      setSuccess('Successfully uploaded receipt!')
      clearSelection() // ✅ clear state + input value
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-lg font-semibold">Upload receipt</div>

      {/* Optional preview */}
      {previewUrl ? (
        <div className="mt-3 overflow-hidden rounded-xl border">
          <img src={previewUrl} alt="Receipt preview" className="h-auto w-full" />
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 p-4 hover:bg-gray-50">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Choose file</span>
            <span className="text-xs text-gray-500">{fileLabel}</span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={onPickFile}
            disabled={isUploading}
          />

          <span className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white">
            Browse
          </span>
        </label>

        <button
          onClick={upload}
          disabled={!file || isUploading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? 'Uploading…' : 'Upload'}
        </button>

        {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {success ? (
          <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</div>
        ) : null}
      </div>
    </div>
  )
}