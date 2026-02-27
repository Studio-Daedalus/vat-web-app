import Image from 'next/image'

import { Container } from '@/components/Container'
import avatarImage1 from '@/images/avatars/avatar-1.png'
import avatarImage2 from '@/images/avatars/avatar-2.png'
import avatarImage3 from '@/images/avatars/avatar-3.png'
import avatarImage4 from '@/images/avatars/avatar-4.png'
import avatarImage5 from '@/images/avatars/avatar-5.png'

const testimonials = [
  [
    {
      content:
        'I didn’t realise card slips aren’t valid VAT receipts. Docket flagged it immediately and saved me a painful end-of-quarter scramble.',
      author: {
        name: 'Sarah M.',
        role: 'Freelance consultant',
        image: avatarImage1,
      },
    },
    {
      content:
        'It’s the first tool that explains VAT without making me feel stupid. The warnings are calm and practical - exactly what I needed.',
      author: {
        name: 'Tom R.',
        role: 'Small agency owner',
        image: avatarImage4,
      },
    },
  ],
  [
    {
      content:
        'Uploading receipts is fast, and the export is clean. My accountant spends less time fixing my data and more time advising.',
      author: {
        name: 'Jade K.',
        role: 'E-commerce seller',
        image: avatarImage5,
      },
    },
    {
      content:
        'The “missing VAT number” warning caught a supplier issue I would have missed. I got a corrected invoice and reclaimed VAT properly.',
      author: {
        name: 'Ben L.',
        role: 'Trades & services',
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        'The best part is confidence. I submit my VAT return feeling certain rather than hopeful.',
      author: { name: 'Priya S.', role: 'Sole trader', image: avatarImage3 },
    },
    {
      content:
        'Simple, grounded, and genuinely useful. It feels like a friendly safety check before I file anything.',
      author: {
        name: 'Michael H.',
        role: 'Director, small business',
        image: avatarImage4,
      },
    },
  ],
]

function QuoteIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      width={48}
      height={36}
      viewBox="0 0 105 78"
      {...props}
    >
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  )
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What customers say"
      className="bg-[#FAF8F3] py-20 sm:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-[#2B3A2E] sm:text-4xl">
            Trusted when VAT feels stressful.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#7A8A7E]">
            Built for people doing their VAT late at night - who want calm
            clarity, not another dashboard.
          </p>
        </div>

        <ul
          role="list"
          className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((t, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className="relative rounded-3xl border border-[#E0DAD0] bg-white/70 p-6 shadow-sm backdrop-blur">
                      <QuoteIcon className="absolute top-6 left-6 fill-[#C4DCBE]" />
                      <blockquote className="relative pt-6">
                        <p className="text-base leading-relaxed text-[#2B3A2E]">
                          {t.content}
                        </p>
                      </blockquote>

                      <figcaption className="mt-6 flex items-center justify-between border-t border-[#E0DAD0] pt-6">
                        <div>
                          <div className="font-display text-base text-[#2B3A2E]">
                            {t.author.name}
                          </div>
                          <div className="mt-1 text-sm text-[#7A8A7E]">
                            {t.author.role}
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-full bg-[#FAF8F3] ring-1 ring-[#E0DAD0]">
                          <Image
                            className="h-12 w-12 object-cover"
                            src={t.author.image}
                            alt=""
                            width={48}
                            height={48}
                          />
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
