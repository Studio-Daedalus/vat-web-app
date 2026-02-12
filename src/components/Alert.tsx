'use client'

import { useEffect, useState } from 'react'

type AlertType = 'info' | 'success' | 'error'

type AlertProps = {
  type: AlertType
  message: string
}

const alertConfig = {
  info: {
    title: 'Info',
    wrapper:
      'bg-blue-50 dark:bg-blue-500/10 dark:outline dark:outline-blue-500/20',
    icon: 'text-blue-400',
    text: 'text-blue-800 dark:text-blue-300',
    button:
      'bg-blue-50 text-blue-500 hover:bg-blue-100 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-500/10',
    ring: 'focus-visible:ring-blue-600 focus-visible:ring-offset-blue-50 dark:focus-visible:ring-blue-500 dark:focus-visible:ring-offset-blue-900',
  },
  success: {
    title: 'Success',
    wrapper:
      'bg-green-50 dark:bg-green-500/10 dark:outline dark:outline-green-500/20',
    icon: 'text-green-400',
    text: 'text-green-800 dark:text-green-300',
    button:
      'bg-green-50 text-green-500 hover:bg-green-100 dark:bg-transparent dark:text-green-400 dark:hover:bg-green-500/10',
    ring: 'focus-visible:ring-green-600 focus-visible:ring-offset-green-50 dark:focus-visible:ring-green-500 dark:focus-visible:ring-offset-green-900',
  },
  error: {
    title: 'Error',
    wrapper:
      'bg-red-50 dark:bg-red-500/10 dark:outline dark:outline-red-500/20',
    icon: 'text-red-400',
    text: 'text-red-800 dark:text-red-300',
    button:
      'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10',
    ring: 'focus-visible:ring-red-600 focus-visible:ring-offset-red-50 dark:focus-visible:ring-red-500 dark:focus-visible:ring-offset-red-900',
  },
}


export function Alert({ type, message }: AlertProps) {
  const [visible, setVisible] = useState(true)

  const config = alertConfig[type]

  // ⭐ Auto close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // ⭐ Don't render when hidden
  if (!visible) return null

  return (
    <div
      className={`fixed top-6 right-6 z-50 rounded-md p-4 ${config.wrapper}`}
    >
      {' '}
      <div className="flex">
        <div className="shrink-0">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className={`size-5 ${config.icon}`}
          >
            <path
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${config.text}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setVisible(false)}
              className={`inline-flex rounded-md p-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden ${config.button} ${config.ring}`}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                data-slot="icon"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
