import { C } from '../../../styles/colours'

export function IconDashboard({ active }: { active: boolean }) {
  const c = active ? C.fern : C.stone
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="#4e545c"
        strokeWidth="2"
        fill={active ? C.lichen : 'none'}
        fillOpacity={active ? 0.4 : 0}
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="#4e545c"
        strokeWidth="2"
        fill={active ? C.lichen : 'none'}
        fillOpacity={active ? 0.4 : 0}
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="#4e545c"
        strokeWidth="2"
        fill={active ? C.lichen : 'none'}
        fillOpacity={active ? 0.4 : 0}
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="#4e545c"
        strokeWidth="2"
        fill={active ? C.lichen : 'none'}
        fillOpacity={active ? 0.4 : 0}
      />
    </svg>
  )
}
