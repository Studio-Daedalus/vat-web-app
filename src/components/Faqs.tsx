import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'What does Docket actually do?',
      answer:
        'You upload a receipt or invoice and Docket extracts the key details (vendor, date, items, totals). It then checks VAT basics and flags potential issues - in plain English.',
    },
    {
      question: 'Will it tell me if VAT is reclaimable?',
      answer:
        'Yes - where the receipt includes the right evidence. If VAT reclaim depends on context (for example, mixed business/personal use), we’ll show a clear warning rather than guessing.',
    },
    {
      question: 'Is a card payment slip a valid VAT receipt?',
      answer:
        'Usually no. A card slip proves you paid, but it often doesn’t show VAT details. Docket will flag this and tell you what you need to reclaim VAT correctly.',
    },
  ],
  [
    {
      question: 'Does this replace Xero or QuickBooks?',
      answer:
        'No. Think of Docket as a VAT clarity layer. Your accounting software is great for bookkeeping - we focus on making VAT feel obvious and reducing mistakes.',
    },
    {
      question: 'Can I export data for MTD?',
      answer:
        'Yes. You can export clean, structured data for your VAT workflow (and your accountant). The aim is “ready to use” rather than another spreadsheet to fix.',
    },
    {
      question: 'What if the photo is blurry?',
      answer:
        'We’ll tell you if we couldn’t read it and what to change (lighting, angle, focus). You’ll never be charged “silently” for a failed scan.',
    },
  ],
  [
    {
      question: 'Is my data secure?',
      answer:
        'Receipts are stored securely and linked to your account. You stay in control of your data, and you can delete receipts whenever you want.',
    },
    {
      question: 'How accurate is it?',
      answer:
        'It’s designed to be conservative: we extract what’s visible, and we flag uncertainty rather than making assumptions. For complex scenarios, we’ll recommend what evidence you need.',
    },
    {
      question: 'Can my accountant use this too?',
      answer:
        'Yes. Many customers share exports with their accountant, and teams can use shared workflows on higher plans.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-[#FAF8F3] py-20 sm:py-28"
    >
      <Image
        className="pointer-events-none absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4 opacity-[0.08]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-[#2B3A2E] sm:text-4xl"
          >
            Questions, answered calmly.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#7A8A7E]">
            VAT is stressful enough. Here are the things people ask us most.
          </p>
        </div>

        <ul
          role="list"
          className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex} className="space-y-6">
              {column.map((faq, faqIndex) => (
                <div
                  key={faqIndex}
                  className="rounded-2xl border border-[#E0DAD0] bg-white/70 p-6 shadow-sm backdrop-blur"
                >
                  <h3 className="font-display text-lg leading-7 text-[#2B3A2E]">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#7A8A7E]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-[#E0DAD0] bg-white/70 p-6 backdrop-blur">
          <p className="text-sm text-[#2B3A2E]">
            Still unsure about something?
            <span className="text-[#7A8A7E]">
              {' '}
              Email support and we’ll help you figure it out.
            </span>
          </p>
        </div>
      </Container>
    </section>
  )
}
