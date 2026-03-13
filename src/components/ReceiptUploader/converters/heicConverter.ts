import heicConvert from 'heic-convert'

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4 MB

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

/**
 * Compresses an image file using the Canvas API until it is under maxBytes.
 * Iterates from quality 0.9 down to 0.1 in steps of 0.1.
 */
export async function compressImageToLimit(
  file: File,
  maxBytes = MAX_FILE_BYTES,
): Promise<File> {
  if (file.size <= maxBytes) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas not supported'))
      ctx.drawImage(img, 0, 0)

      let quality = 0.9

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Canvas compression failed'))
            if (blob.size <= maxBytes || quality <= 0.1) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            } else {
              quality = Math.round((quality - 0.1) * 10) / 10
              tryCompress()
            }
          },
          'image/jpeg',
          quality,
        )
      }

      tryCompress()
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for compression'))
    }

    img.src = url
  })
}

export async function normaliseImageFile(
  file: File,
  quality = 0.92,
): Promise<File> {
  if (!isHeic(file)) return file

  const jpegBuffer = await convertHeicToJpeg(file, quality)
  const jpegName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
  const jpegFile = new File([jpegBuffer], jpegName, { type: 'image/jpeg' })

  return compressImageToLimit(jpegFile)
}
