type CreateUploadUrlResponse = {
  receiptId: string
  s3Key: string
  uploadUrl: string
  uploadMethod?: string
  expiresInSecs?: number
}

type CreateUploadUrlClientResult =
  | { ok: true; data: CreateUploadUrlResponse }
  | { ok: false; message: string }

export async function createUploadUrlClient(input: {
  filename: string
  contentType?: string
}): Promise<CreateUploadUrlClientResult> {
  const res = await fetch('/api/receipts/createUploadUrl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    return { ok: false, message: json?.error ?? 'Failed to create upload URL' }
  }
  if (!json?.uploadUrl) {
    return { ok: false, message: 'API did not return an uploadUrl' }
  }

  return { ok: true, data: json as CreateUploadUrlResponse }
}

export function guessFileType(file: File): string {
  const name = file.name.toLowerCase()

  // Get extension (everything after last ".")
  const parts = name.split('.')
  if (parts.length < 2) return ''

  const ext = parts.pop()

  // Map extensions → MIME types
  const mimeMap: Record<string, string> = {
    jpg: 'jpg',
    jpeg: 'jpeg',
    png: 'png',
    webp: 'webp',
    gif: 'gif',
    pdf: 'pdf',
    txt: 'txt',
    csv: 'csv',
    json: 'json',
    heic: 'heic',
    svg: 'svg',
  }

  return mimeMap[ext ?? ''] ?? ''
}

export function guessContentType(file: File): string {
  if (file.type) return file.type
  const name = file.name.toLowerCase()
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
  if (name.endsWith('.png')) return 'image/png'
  if (name.endsWith('.pdf')) return 'application/pdf'
  return 'application/octet-stream'
}
