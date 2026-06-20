import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  CheckIcon,
  CpuChipIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import NavBar from '../components/NavBar.jsx'

const features = [
  {
    name: 'Built around your prospect',
    description: 'Turn a few useful details into outreach that sounds researched—not mass produced.',
    icon: CpuChipIcon
  },
  {
    name: 'Ready in a few seconds',
    description: 'Move from a blank page to a polished first draft while the lead is still fresh.',
    icon: BoltIcon
  },
  {
    name: 'Made to earn replies',
    description: 'Keep messages concise, relevant, and focused on a clear next step.',
    icon: ChartBarIcon
  }
]

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(circle_at_72%_18%,rgba(92,129,255,0.18),transparent_30%),radial-gradient(circle_at_15%_12%,rgba(83,222,196,0.12),transparent_25%)]" />

      <NavBar variant="public" />

      <main id="top" className="relative">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-28 lg:pt-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
              <SparklesIcon className="size-4" />
              Thoughtful outreach, minus the blank page
            </div>

            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Cold emails that feel{' '}
              <span className="relative whitespace-nowrap text-blue-600">
                genuinely warm.
                <svg className="absolute -bottom-2 left-0 w-full text-blue-300" viewBox="0 0 320 12" fill="none" aria-hidden="true">
                  <path d="M3 8.5C85 2.5 212 2 317 6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Give ColdMail the context. Get a clear, personalized message that sounds like you and gives prospects a reason to reply.
            </p>

            <div id="get-started" className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#how-it-works" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600">
                Write my first email
                <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                See what it can do
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {['No templates to wrestle with', 'Edit every word'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckIcon className="size-3.5" /></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-blue-200/50 via-transparent to-emerald-200/40 blur-2xl" />
            <div className="relative rotate-1 rounded-[2rem] border border-white/80 bg-white/85 p-3 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-500 hover:rotate-0">
              <div className="rounded-[1.45rem] border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><DocumentTextIcon className="size-5" /></span>
                    <div><p className="text-sm font-semibold">New outreach</p><p className="text-xs text-slate-400">AI draft</p></div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ready</span>
                </div>

                <div className="space-y-5 p-5 sm:p-7">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prospect</p><p className="mt-1 text-sm font-medium">Avery at Northstar</p></div>
                    <div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tone</p><p className="mt-1 text-sm font-medium">Warm & direct</p></div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                    <p className="font-semibold text-slate-900">Subject: A small idea for Northstar</p>
                    <p className="mt-4">Hey Avery,</p>
                    <p className="mt-3">I noticed your team is expanding into new markets. We help growing teams spend less time writing outreach while keeping every note personal.</p>
                    <p className="mt-3">Worth a quick conversation next week?</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {['bg-blue-500', 'bg-violet-500', 'bg-emerald-500'].map((color) => <span key={color} className={`size-8 rounded-full border-2 border-white ${color}`} />)}
                    </div>
                    <button type="button" className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white">Use this draft</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-slate-200/80 bg-white/70 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Less busywork, better conversations</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Everything you need to hit send with confidence.</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map(({ name, description, icon: Icon }, index) => (
                <article key={name} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white"><Icon className="size-6" /></span>
                    <span className="text-sm font-semibold text-slate-300">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-lg font-bold">{name}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <p className="text-sm font-semibold text-blue-300">Your next great conversation starts here</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-5xl">From context to a credible email in moments.</h2>
            <a href="#top" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50">Start creating <ArrowRightIcon className="size-4" /></a>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-200 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p className="font-semibold text-slate-700">ColdMail<span className="text-blue-600">.</span></p>
        <p>© {new Date().getFullYear()} ColdMail. Made for better introductions.</p>
      </footer>
    </div>
  )
}

export default LandingPage
