import { Suspense } from 'react'
import ConfirmForm from './ConfirmForm'

export default function Page() {
  return (
    <Suspense>
      <ConfirmForm />
    </Suspense>
  )
}
