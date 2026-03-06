import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'

function CheckBadge(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
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

export function CallToAction() {
  return (
    <section
      id="get-started"
      className="relative overflow-hidden bg-[#FAF8F3] py-20 sm:py-28"
    >
      {/* Subtle texture */}
      <Image
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        src={backgroundImage}
        alt=""
        unoptimized
        priority
      />

      {/* Soft gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#C4DCBE]/25 via-transparent to-transparent" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#E0DAD0] bg-white/60 px-4 py-2 text-sm font-medium text-[#2B3A2E] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#3E6B52]" />
            Built for UK sole traders & small teams
          </p>

          <h2 className="mt-6 font-display text-3xl tracking-tight text-[#2B3A2E] sm:text-4xl">
            Stop guessing VAT.
            <span className="block">Know you’re doing it right.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#7A8A7E]">
            Snap a photo of a receipt and we’ll pull out the VAT, flag
            reclaimable amounts, and warn you about common HMRC mistakes — in
            plain English.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {[
              'Extract items, totals, and VAT automatically',
              'Flag reclaimable VAT (and what to avoid)',
              'Export clean data for MTD / your accountant',
            ].map((t) => (
              <div
                key={t}
                className="flex items-start gap-3 rounded-2xl border border-[#E0DAD0] bg-white/70 p-4 backdrop-blur"
              >
                <CheckBadge className="mt-0.5 h-5 w-5 text-[#3E6B52]" />
                <p className="text-sm leading-relaxed text-[#2B3A2E]">{t}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="/register"
              className="w-full rounded-xl bg-[#3E6B52] px-6 py-3 text-white hover:bg-[#2F5A44] sm:w-auto"
            >
              Create free account
            </Button>

            <Button
              href="#pricing"
              variant="outline"
              className="w-full rounded-xl border-[#E0DAD0] bg-transparent px-6 py-3 text-[#2B3A2E] hover:bg-white/60 sm:w-auto"
            >
              See pricing
            </Button>
          </div>

          <p className="mt-4 text-sm text-[#7A8A7E]">
            No card required. Works with your existing workflow.
          </p>
        </div>
      </Container>
    </section>
  )
}
