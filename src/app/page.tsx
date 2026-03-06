import { CallToAction } from '@/containers/LandingPage/CallToAction'
import { Faqs } from '@/containers/LandingPage/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/Hero'
import { Pricing } from '@/containers/LandingPage/Pricing'
import { PrimaryFeatures } from '@/containers/LandingPage/PrimaryFeatures'
import { SecondaryFeatures } from '@/containers/LandingPage/SecondaryFeatures'
import { Testimonials } from '@/containers/LandingPage/Testimonials'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
