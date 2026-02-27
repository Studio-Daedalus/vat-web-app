'use client'

import { useId } from 'react'
import Image, { type ImageProps } from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
// Using existing image paths from your template
import screenshotReporting from '@/images/screenshots/profit-loss.png'
import screenshotInventory from '@/images/screenshots/inventory.png'
import screenshotContacts from '@/images/screenshots/contacts.png'

interface Feature {
  name: React.ReactNode
  summary: string
  description: string
  image: ImageProps['src']
  icon: React.ComponentType
}

const features: Array<Feature> = [
  {
    name: 'Threshold Monitoring',
    summary: 'Never get caught off-guard by the £90k VAT limit.',
    description:
      'Docket tracks your rolling 12-month turnover and alerts you well before you reach mandatory HMRC registration limits.',
    image: screenshotReporting,
    icon: function ThresholdIcon() {
      return (
        <path
          d="M8 24V12M18 24V8M28 24V16"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )
    },
  },
  {
    name: 'MTD-Compatible Export',
    summary: 'Seamless handovers for your accountant or HMRC.',
    description:
      'Generate structured, Making Tax Digital (MTD) ready exports that integrate perfectly with your final submission workflow.',
    image: screenshotInventory,
    icon: function MTDIcon() {
      return (
        <path
          d="M10 20L18 28L30 12"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )
    },
  },
  {
    name: 'Edge-Case Logic',
    summary: 'Expert guidance on reverse charges and mixed-use expenses.',
    description:
      'Navigate complex scenarios with conservative, HMRC-aligned logic designed specifically for UK micro-businesses.',
    image: screenshotContacts,
    icon: function LogicIcon() {
      return (
        <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth={2} />
      )
    },
  },
]

function Feature({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  feature: Feature
  isActive: boolean
}) {
  return (
    <div
      className={clsx(
        className,
        !isActive && 'opacity-60 transition-opacity hover:opacity-100',
      )}
      {...props}
    >
      <div
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
          isActive
            ? 'bg-[#2D4A2D] text-[#D1EAD1]'
            : 'bg-[#E2E8E2] text-[#4F634F]',
        )}
      >
        <svg aria-hidden="true" className="h-6 w-6" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3
        className={clsx(
          'mt-6 text-sm font-medium',
          isActive ? 'text-[#2D4A2D]' : 'text-[#4F634F]',
        )}
      >
        {feature.name}
      </h3>
      <p className="mt-2 font-display text-xl text-[#1A2E1A]">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-[#4F634F]">{feature.description}</p>
    </div>
  )
}

function FeaturesMobile() {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature feature={feature} isActive className="mx-auto max-w-2xl" />
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 top-8 bottom-0 bg-[#F2F5F2] sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 shadow-green-900/5 ring-green-500/10">
              <Image
                className="w-full"
                src={feature.image}
                alt=""
                sizes="52.75rem"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeaturesDesktop() {
  return (
    <TabGroup className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <TabList className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Tab key={feature.summary} className="focus:outline-none">
                <Feature
                  feature={feature}
                  isActive={featureIndex === selectedIndex}
                  className="text-left"
                />
              </Tab>
            ))}
          </TabList>
          <TabPanels className="relative mt-20 overflow-hidden rounded-[2.5rem] bg-[#F2F5F2] px-14 py-16 xl:px-16">
            <div className="flex">
              {features.map((feature, featureIndex) => (
                <TabPanel
                  static
                  key={feature.summary}
                  className={clsx(
                    'px-5 transition duration-500 ease-in-out focus:outline-none',
                    featureIndex !== selectedIndex && 'opacity-0',
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 shadow-green-900/5 ring-green-500/10">
                    <Image
                      className="w-full"
                      src={feature.image}
                      alt=""
                      sizes="52.75rem"
                    />
                  </div>
                </TabPanel>
              ))}
            </div>
          </TabPanels>
        </>
      )}
    </TabGroup>
  )
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for UK small businesses"
      className="bg-[#F9FBF9] pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-[#1A2E1A] sm:text-4xl">
            Built for UK freelancers and micro-businesses.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-[#4F634F]">
            Docket handles the technical VAT edge cases so you can focus on
            running your business.
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  )
}
