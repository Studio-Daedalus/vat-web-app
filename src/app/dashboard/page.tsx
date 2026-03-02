export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2B3A2E]">Dashboard</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Receipts scanned */}
        <section className="rounded-2xl border border-[#E0DAD0] bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-[#7A8A7E]">
            Receipts scanned this month
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-semibold text-[#2B3A2E]">42</span>
            <span className="text-sm text-[#7A8A7E]">receipts</span>
          </div>
          <div className="mt-3 text-sm text-[#7A8A7E]">
            Up from last month (+8).
          </div>
        </section>

        {/* Card 2: Spend chart */}
        <section className="rounded-2xl border border-[#E0DAD0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#7A8A7E]">
              Spend this month
            </div>
            <div className="text-sm font-semibold text-[#2B3A2E]">£2,340</div>
          </div>

          <div className="mt-4">
            <div className="h-28 w-full rounded-xl bg-[#FAF8F3] p-3">
              <svg viewBox="0 0 240 80" className="h-full w-full">
                <defs>
                  <linearGradient id="spendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6AAF7B" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6AAF7B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 65 L20 58 L40 60 L60 50 L80 52 L100 45 L120 40 L140 44 L160 36 L180 30 L200 34 L220 22 L240 18 L240 80 L0 80 Z"
                  fill="url(#spendFill)"
                />
                <path
                  d="M0 65 L20 58 L40 60 L60 50 L80 52 L100 45 L120 40 L140 44 L160 36 L180 30 L200 34 L220 22 L240 18"
                  fill="none"
                  stroke="#3E6B52"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#7A8A7E]">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
