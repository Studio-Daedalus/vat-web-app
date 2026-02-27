import React from 'react'

// Color Palette based on Greenhouse Brand Guide: Organic, Grounded, and Calm
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F9FBF9] py-20 lg:py-32">
      {/* Decorative Background "Building Blocks" - Rounded & Organic */}
      <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/4 -translate-y-1/2 rounded-full bg-[#F9FBF9] opacity-50 blur-3xl" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          {/* Left Content: The Problem & Value Prop */}
          <div className="space-y-8 lg:w-1/2">
            <div className="inline-block rounded-full bg-[#D1EAD1] px-4 py-1.5 text-sm font-medium text-[#2D4A2D]">
              UK VAT Intelligence Assistant
            </div>

            <h1 className="text-5xl leading-tight font-bold text-[#1A2E1A] lg:text-6xl">
              Stop guessing. <br />
              <span className="text-[#4A7C4A]">Understand your VAT.</span>
            </h1>

            <p className="max-w-lg text-xl leading-relaxed text-[#4F634F]">
              Accounting software calculates, but it doesn't explain. We prevent
              costly HMRC mistakes before you hit submit with plain-English
              guidance.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-2xl bg-[#2D4A2D] px-8 py-4 font-semibold text-white shadow-lg shadow-green-900/10 transition-all hover:bg-[#3D633D]">
                Start Your Pre-Submission Check
              </button>
              <button className="rounded-2xl border-2 border-[#E2E8E2] bg-white px-8 py-4 font-semibold text-[#2D4A2D] transition-all hover:bg-[#F2F5F2]">
                How it works
              </button>
            </div>

            <p className="text-sm text-[#7A8C7A]">
              Designed specifically for UK micro-businesses and contractors.
            </p>
          </div>

          {/* Right Content: The "Intelligence Layer" Visual */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-[2.5rem] border border-[#EDF2ED] bg-white p-8 shadow-2xl shadow-green-900/5">
              {/* Mockup VAT Warning Card */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#F0F4F0] pb-4">
                  <span className="font-bold text-[#1A2E1A]">
                    Your VAT Summary
                  </span>
                  <span className="text-xs text-[#7A8C7A]">
                    Current Quarter
                  </span>
                </div>

                <div className="rounded-xl border-l-4 border-[#F59E0B] bg-[#FFF9F0] p-5">
                  <div className="flex gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[10px] font-bold text-white">
                      !
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-balance text-[#854D0E]">
                        Potential Risk Detected
                      </p>
                      <p className="text-xs text-[#A16207]">
                        This receipt from "AWS UK" requires a Reverse Charge
                        entry. Your current software hasn't flagged this.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded-full bg-[#F2F5F2]" />
                  <div className="h-4 w-1/2 rounded-full bg-[#F2F5F2]" />
                </div>

                <div className="flex justify-end pt-4">
                  <div className="rounded-lg bg-[#F0F7F0] px-4 py-2 text-xs font-bold tracking-wider text-[#2D4A2D] uppercase">
                    Explain This Treatment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
