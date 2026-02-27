import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={clsx('h-5 w-5 flex-none', className)}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M9.2 12.9 7.3 11a1 1 0 0 0-1.4 1.4l2.6 2.6a1 1 0 0 0 1.5-.1l6.8-8.4A1 1 0 1 0 15.3 5l-6.1 7.9Z"
        fill="currentColor"
      />
      <path
        d="M12 22A10 10 0 1 1 12 2a10 10 0 0 1 0 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
    </svg>
  )
}

function Plan({
  name,
  price,
  cadence,
  description,
  href,
  features,
  featured = false,
  badge,
  footerNote,
  ctaLabel = 'Start',
}: {
  name: string
  price: string
  cadence: string
  description: string
  href: string
  features: Array<string>
  featured?: boolean
  badge?: string
  footerNote?: string
  ctaLabel?: string
}) {
  return (
    <section
      className={clsx(
        'flex h-full flex-col rounded-3xl border px-6 py-8 sm:px-8',
        featured
          ? 'border-[#2B3A2E] bg-[#2B3A2E] text-[#FAF8F3] shadow-lg'
          : 'border-[#E0DAD0] bg-white/70 text-[#2B3A2E] shadow-sm',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            className={clsx(
              'font-display text-lg',
              featured ? 'text-[#FAF8F3]' : 'text-[#2B3A2E]',
            )}
          >
            {name}
          </h3>
          <p
            className={clsx(
              'mt-2 text-sm leading-relaxed',
              featured ? 'text-[#FAF8F3]/80' : 'text-[#7A8A7E]',
            )}
          >
            {description}
          </p>
        </div>

        {badge ? (
          <span
            className={clsx(
              'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
              featured
                ? 'bg-[#C8956B] text-[#2B3A2E]'
                : 'bg-[#C4DCBE] text-[#2B3A2E]',
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <p className="font-display text-4xl">{price}</p>
        <p
          className={clsx(
            'text-sm',
            featured ? 'text-[#FAF8F3]/80' : 'text-[#7A8A7E]',
          )}
        >
          {cadence}
        </p>
      </div>

      <ul
        role="list"
        className={clsx(
          'mt-8 flex flex-col gap-y-3 text-sm',
          featured ? 'text-[#FAF8F3]' : 'text-[#2B3A2E]',
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CheckIcon
              className={featured ? 'text-[#6AAF7B]' : 'text-[#3E6B52]'}
            />
            <span
              className={clsx(
                featured ? 'text-[#FAF8F3]/90' : 'text-[#2B3A2E]',
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          href={href}
          className={clsx(
            'w-full rounded-xl px-6 py-3',
            featured
              ? 'bg-[#3E6B52] text-white hover:bg-[#2F5A44]'
              : 'bg-[#3E6B52] text-white hover:bg-[#2F5A44]',
          )}
          aria-label={`Get started with the ${name} plan`}
        >
          {ctaLabel}
        </Button>

        {footerNote ? (
          <p
            className={clsx(
              'mt-3 text-center text-xs',
              featured ? 'text-[#FAF8F3]/70' : 'text-[#7A8A7E]',
            )}
          >
            {footerNote}
          </p>
        ) : null}
      </div>
    </section>
  )
}

/**
 * Pricing + scan limits based on:
 * - Cost per scan ≈ £0.03
 * - Target profit margin = 70%  => costs <= 30% of price
 * - Therefore max scans/month ≈ (0.30 * price) / 0.03 = 10 * price (£)
 *
 * We round to clean marketing numbers.
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-[#FAF8F3] py-20 sm:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-[#2B3A2E] sm:text-4xl">
            Pricing that stays simple.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#7A8A7E]">
            Start on Free. Upgrade when you’re scanning regularly. Every plan
            includes VAT checks and clear notes.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
          <Plan
            name="Free"
            price="£0"
            cadence="/ month"
            description="Try Docket and see if it fits your workflow."
            href="/register"
            ctaLabel="Create free account"
            footerNote="No card required"
            features={[
              '10 receipt scans / month',
              'Vendor, date, totals extracted',
              'Basic VAT visibility (when shown on receipt)',
              'Monthly list of expenses',
            ]}
          />

          <Plan
            name="Starter"
            price="£15"
            cadence="/ month"
            description="For sole traders scanning a little each week."
            href="/register"
            ctaLabel="Choose Starter"
            footerNote="Cancel anytime"
            features={[
              '150 receipt scans / month',
              'Items + VAT extracted where possible',
              'Reclaimable VAT highlights + notes',
              'Export for your accountant',
            ]}
          />

          <Plan
            featured
            name="Core"
            price="£29"
            cadence="/ month"
            description="Best value for monthly bookkeeping and VAT returns."
            badge="Most popular"
            href="/register"
            ctaLabel="Choose Core"
            footerNote="Cancel anytime"
            features={[
              '290 receipt scans / month',
              'HMRC mistake warnings (card slips, missing VAT numbers)',
              'Clear reclaim guidance (conservative, no guessing)',
              'MTD-friendly export formats',
              'Priority processing',
            ]}
          />

          <Plan
            name="Pro"
            price="£59"
            cadence="/ month"
            description="For higher volume, small teams, and accountant workflows."
            badge="Copper tier"
            href="/register"
            ctaLabel="Choose Pro"
            footerNote="Cancel anytime"
            features={[
              '590 receipt scans / month',
              'Multi-user access',
              'Advanced exports + audit-ready summaries',
              'Shared monthly reporting',
              'Priority support',
            ]}
          />
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#E0DAD0] bg-white/70 p-6 text-center shadow-sm backdrop-blur sm:p-8">
          <p className="text-sm text-[#2B3A2E]">
            Tip:{' '}
            <span className="text-[#7A8A7E]">
              If you’re close to your scan limit, we’ll warn you before you hit
              it. Upgrading should feel calm — not urgent.
            </span>
          </p>
        </div>
      </Container>
    </section>
  )
}
