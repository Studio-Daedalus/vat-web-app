import SettingsPage from '@/containers/SettingsPage/SettingsPage'
import { GetUser } from '@/lib/server/user/getUser'

// This forces the build to run dynamically, rather than requiring an active endpoint
export const dynamic = 'force-dynamic'

export default async function Settings() {
  const result = await GetUser()
  if (!result.ok) throw new Error(result.message)

  return <SettingsPage user={result.user} />
}
