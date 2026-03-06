import { C } from '../../../styles/colours'

// The Greenhouse sprout logomark.
// Rendered inside a Forest-coloured rounded square container in the sidebar.

export function Logomark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20V10"
        stroke={C.clover}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 10C12 10 8 9 7 5c3.5-.5 6 1.5 5 5Z"
        fill={C.clover}
        fillOpacity="0.9"
      />
      <path
        d="M12 13C12 13 16 12 17 8c-3.5-.5-6 1.5-5 5Z"
        fill={C.lichen}
        fillOpacity="0.9"
      />
    </svg>
  )
}
