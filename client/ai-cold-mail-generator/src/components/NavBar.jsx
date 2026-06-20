import { ArrowRightIcon, Bars3Icon, SparklesIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth.context.jsx'

const NavBar = ({ variant = 'dashboard', onOpenSidebar, title = 'AI Outreach Studio', subtitle = 'Create, refine, and send with confidence' }) => {
  const { user } = useAuth()

  const initials = (user?.userName || user?.email || 'U')
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  if (variant === 'public') {
    return (
      <header className="relative z-20 border-b border-slate-200/60 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="ColdMail home">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
              <SparklesIcon className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">ColdMail<span className="text-blue-600">.</span></span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
            <a className="transition hover:text-slate-950" href="#features">Features</a>
            <a className="transition hover:text-slate-950" href="#how-it-works">How it works</a>
          </nav>

          {user ? (
            <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:px-5">
              Dashboard
              <ArrowRightIcon className="hidden size-4 transition group-hover:translate-x-0.5 sm:block" />
            </Link>
          ) : (
            <div className="flex items-center gap-1 sm:gap-3">
              <Link to="/login" className="rounded-full px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-slate-950 sm:px-4">Log in</Link>
              <Link to="/signup" className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:px-5">Sign up</Link>
            </div>
          )}
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Bars3Icon className="size-6" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          <p className="truncate text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          AI ready
        </div>

        <div className="h-7 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white">{initials}</span>
          <div className="hidden max-w-36 sm:block">
            <p className="truncate text-xs font-semibold text-slate-800">{user?.userName || 'ColdMail user'}</p>
            <p className="flex items-center gap-1 text-[10px] text-slate-400"><SparklesIcon className="size-3" /> Personal workspace</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
