import heicConvert from 'heic-convert'

/**
 * Converts a HEIC/HEIFF file to a JPEG Buffer.
 */
export async function convertHeicToJpeg(
  file: File | Blob,
  quality = 0.92,
): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  const outputBuffer = await heicConvert({
    buffer: inputBuffer as unknown as ArrayBufferLike,
    format: 'JPEG',
    quality,
  })

  return Buffer.from(outputBuffer)
}

export function isHeic(file: File): boolean {
  const heicMimeTypes = new Set([
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence',
  ])

  if (heicMimeTypes.has(file.type.toLowerCase())) return true

  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'heic' || ext === 'heif'
}

export async function normaliseImageFile(
  file: File,
  quality = 0.92,
): Promise<File> {
  if (!isHeic(file)) return file

  const jpegBuffer = await convertHeicToJpeg(file, quality)
  const jpegName = file.name.replace(/\.(heic|heif)$/i, '.jpg')

  return new File([jpegBuffer], jpegName, { type: 'image/jpeg' })
}
