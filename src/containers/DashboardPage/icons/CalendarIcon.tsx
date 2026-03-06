import { C } from '@/styles/colours'

export function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke={C.stone}
        strokeWidth="2"
      />
      <path
        d="M16 2v4M8 2v4M3 10h18"
        stroke={C.stone}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
