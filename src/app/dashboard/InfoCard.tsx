'use client'

import { useRouter } from 'next/navigation'

type InfoCardProps = {
  title: string
  description: string
  buttonText: string
  illustration: React.ReactNode
  link?: string
}

export function InfoCard({
  title,
  description,
  illustration,
  buttonText,
  link,
}: InfoCardProps) {
  const router = useRouter()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4">
        {illustration}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="max-w-md text-sm text-gray-500">{description}</p>
        </div>

        <div>
          <button
            onClick={() => router.push(link ?? '/dashboard')}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {buttonText} &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}


