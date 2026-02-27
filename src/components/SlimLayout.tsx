import Image from 'next/image'

import backgroundImage from '@/images/background-auth.jpg'

export function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#FAF8F3]">
      {/* Subtle brand wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#C4DCBE]/30 via-transparent to-transparent" />

      <div className="relative flex min-h-screen justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-[#E0DAD0] bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
            {children}
          </div>
          <p className="mt-6 text-center text-xs text-[#7A8A7E]">
            Calm VAT clarity for UK small businesses.
          </p>
        </div>
      </div>

      {/* Optional subtle texture on large screens (kept brand-safe).
          If you still want to use an image, replace background-auth.jpg with a green-toned texture.
      */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover opacity-[0.06]"
          src={backgroundImage}
          alt=""
          unoptimized
        />
      </div>
    </div>
  )
}
