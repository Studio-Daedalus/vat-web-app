import { InfoCard } from '@/app/dashboard/InfoCard'
import { ReceiptIllustration } from './assets/receipt'
import { AIChatIllustration } from './assets/chat'

// UI Example
// https://www.flowbite.com/blocks/e-commerce/account-overview/

type StatCardProps = {
  title: string
  subtitle: string
  icon: React.ReactNode
}

type ProfileProps = {
  name: string
  email: string
  occupation?: string
  memberSince: number
  avatarUrl: string
}

export default function DashboardPage() {
  const profile = {
    name: 'Josh Hellawell',
    email: 'josh@hellawell.co.uk',
    occupation: 'Sole Trader',
    memberSince: 1777593600,
    avatarUrl: 'https://ui-avatars.com/api/?background=e5e7eb&color=6b7280&name=JH',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {"Your Dashboard"}
      </h1>

      <ProfileCard {...profile} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InfoCard
          title={'Manage your receipts'}
          description={
            'Keep track of all your purchases and download receipts instantly from your dashboard.'
          }
          buttonText={'View 57 receipts'}
          illustration={ReceiptIllustration()}
          link={'/dashboard/receipts'}
        />

        <InfoCard
          title={'AI tax assistant'}
          description={
            'Ask questions about VAT, income, expenses and tax rules. Get instant AI guidance tailored to your business.'
          }
          buttonText={'Start AI chat'}
          illustration={AIChatIllustration()}
          link={'/dashboard/receipts'}
        />
      </div>
    </div>
  )
}


/* -------------------------------------------------- */
/* Profile Card */
/* -------------------------------------------------- */

function ProfileCard({
  name,
  email,
  occupation,
  memberSince,
  avatarUrl,
}: ProfileProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <ProfileCoreInfo name={name} avatarUrl={avatarUrl} />

        <ProfileSupplementaryInfo
          memberSince={memberSince}
          email={email}
          occupation={occupation}
        />
      </div>
    </div>
  )
}

function ProfileCoreInfo({
  name,
  avatarUrl,
}: {
  name: string
  avatarUrl: string
}) {
  return (
    <div className="flex items-start gap-4">
      <img
        src={avatarUrl}
        alt="Profile"
        className="h-14 w-14 rounded-lg object-cover"
      />

      <div>
        <span className="inline-flex rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          PRO Account
        </span>

        <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h2>
      </div>
    </div>
  )
}

/* -------------------------------------------------- */
/* FIXED LAYOUT HERE */
/* -------------------------------------------------- */

function ProfileSupplementaryInfo({
  memberSince,
  email,
  occupation,
}: {
  memberSince: number
  email: string
  occupation?: string
}) {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <InfoBlock label="Email Address" value={email} />
      <InfoBlock label="Occupation" value={occupation ?? 'Unknown'} />
      <InfoBlock label="Member Since" value={formatPrettyDate(memberSince)} />
    </div>
  )
}

/* -------------------------------------------------- */
/* Shared Info Block */
/* -------------------------------------------------- */
function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 text-sm w-fit">
      <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <p className="text-gray-500">{value}</p>
    </div>
  )
}

/* -------------------------------------------------- */
/* Stat Card */
/* -------------------------------------------------- */
function StatCard({ title, subtitle, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40">
          {icon}
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------- */
/* Icons */
/* -------------------------------------------------- */

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.837l.383 1.437m0 0L6.75 12h9.69c.468 0 .874-.324.975-.781l1.2-5.25a.75.75 0 0 0-.732-.969H5.106z"/>
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.255.995-4 2.446-.745-1.451-2.26-2.446-4-2.446C6.015 3.75 4 5.765 4 8.25c0 6.75 8 10.5 8 10.5s8-3.75 8-10.5z"/>
    </svg>
  )
}

/* -------------------------------------------------- */
/* Date Formatter */
/* -------------------------------------------------- */

function formatPrettyDate(epoch: number): string {
  const date = new Date(epoch * 1000)
  const day = date.getDate()
  const year = date.getFullYear()

  const month = date.toLocaleString('en-GB', { month: 'long' })

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'

  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
