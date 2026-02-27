'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
// Keeping original imports for compatibility
import backgroundImage from '@/images/background-features.jpg'
import screenshotReceipts from '@/images/screenshots/expenses.png'
import screenshotWarnings from '@/images/screenshots/payroll.png'
import screenshotExplainer from '@/images/screenshots/reporting.png'
import screenshotAudit from '@/images/screenshots/vat-returns.png'

const features = [
  {
    title: 'Receipt Analysis',
    description:
      'Extract vendor data, dates, and VAT rates automatically to determine reclaimability based on UK rules[cite: 11].',
    image: screenshotReceipts,
  },
  {
    title: 'VAT Risk Warnings',
    description:
      'Instantly flag missing VAT numbers and incorrect rates to prevent costly HMRC mistakes[cite: 13, 18].',
    image: screenshotWarnings,
  },
  {
    title: 'Plain-English Explainer',
    description:
      'Get scenario-based VAT guidance in simple language, not complex tax-code jargon[cite: 5, 12].',
    image: screenshotExplainer,
  },
  {
    title: 'Pre-Submission Checks',
    description:
      'Identify anomalies and HMRC rejection points before your return is officially filed[cite: 15].',
    image: screenshotAudit,
  },
]

export function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')
    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }
    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)
    return () => lgMediaQuery.removeEventListener('change', onMediaQueryChange)
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for VAT compliance"
      className="relative overflow-hidden bg-[#2D4A2D] pt-20 pb-28 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            VAT intelligence that prevents mistakes.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-[#D1EAD1]">
            Docket is the intelligence layer that sits on top of your accounting
            software to explain the rules[cite: 18, 24].
          </p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 transition-all lg:rounded-l-[2rem] lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/20'
                          : 'hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg focus:outline-none',
                            selectedIndex === featureIndex
                              ? 'text-[#2D4A2D] lg:text-white'
                              : 'text-[#D1EAD1] hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-[2rem]" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-[#D1EAD1] group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="mt-10 w-180 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-green-900/20 sm:w-auto lg:mt-0 lg:w-271.25">
                      <Image
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
