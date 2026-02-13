'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BreadCrumb() {
  const pathname = usePathname()

  // "/dashboard/user/receipts/100524"
  const segments = pathname.split('/').filter(Boolean).slice(1) // removes "dashboard"

  const buildHref = (index: number) =>
    '/' + segments.slice(0, index + 1).join('/')

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex items-center space-x-4">
        {/* HOME */}
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {/* Outline Home Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5M5.25 9.75V20.25A1.5 1.5 0 0 0 6.75 21.75H10.5v-6h3v6h3.75A1.5 1.5 0 0 0 18.75 20.25V9.75"
              />
            </svg>

            <span>Dashboard</span>
          </Link>
        </li>

        {segments.map((segment, index) => (
          <li key={index} className="flex items-center gap-3">
            {/* Compact Chevron */}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-3 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 5l5 5-5 5"
              />
            </svg>

            <Link
              href={buildHref(index)}
              className="text-sm font-medium text-gray-500 capitalize hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {decodeURIComponent(segment).replace('-', ' ')}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
