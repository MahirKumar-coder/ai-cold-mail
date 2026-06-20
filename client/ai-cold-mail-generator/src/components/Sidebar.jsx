import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeftStartOnRectangleIcon,
  ClockIcon,
  HomeIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/auth.context.jsx'

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = (user?.userName || user?.email || 'U')
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Close navigation overlay" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15"><SparklesIcon className="size-5" /></span>
            <span className="text-xl font-bold tracking-[-0.04em]">ColdMail<span className="text-blue-600">.</span></span>
          </Link>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Close navigation"><XMarkIcon className="size-5" /></button>
        </div>

        <nav className="flex-1 px-4 py-6" aria-label="Dashboard navigation">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <div className="mt-3 space-y-1.5">
            <a href="#create" onClick={onClose} className="flex items-center gap-3 rounded-2xl bg-blue-50 px-3.5 py-3 text-sm font-semibold text-blue-700">
              <HomeIcon className="size-5" /> Create outreach
            </a>
            <a href="#history" onClick={onClose} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">
              <ClockIcon className="size-5" /> Recent generations
            </a>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-950 p-5 text-white">
            <SparklesIcon className="size-6 text-blue-300" />
            <p className="mt-4 text-sm font-semibold">A useful prompt is specific.</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Include who you’re contacting, what they care about, and the outcome you offer.</p>
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl p-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">{initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.userName || 'ColdMail user'}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <button type="button" onClick={handleLogout} className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Log out">
              <ArrowLeftStartOnRectangleIcon className="size-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
