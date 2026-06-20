import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import api from '../utils/api.js'
import { useAuth } from '../context/auth.context.jsx'

const highlights = [
  'Write personalized emails in seconds',
  'Keep your voice in every message',
  'Turn cold outreach into warm replies'
]

const Login = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const updateField = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    const email = form.email.trim().toLowerCase()

    try {
      const { data } = await api.post('/auth/login', { email, password: form.password })
      login({ ...data.user, token: data.token })
      toast.success(data.message || 'Welcome back!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Login error details:', error)
      const message = error.response?.data?.message
        || (error.request
          ? 'Cannot reach the server. Make sure the backend is running and the API URL is configured correctly.'
          : 'Could not log you in. Please try again.')

      if (error.response?.status === 403 && message.toLowerCase().includes('not verified')) {
        sessionStorage.setItem('verificationEmail', email)
        toast.error('Please verify your email before logging in.')
        navigate('/verify-otp', { state: { email } })
      } else {
        toast.error(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.15),transparent_26%),radial-gradient(circle_at_88%_10%,rgba(167,139,250,0.14),transparent_28%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between p-12 lg:flex xl:p-16">
          <Link to="/" className="flex w-fit items-center gap-3" aria-label="ColdMail home">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
              <SparklesIcon className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">ColdMail<span className="text-blue-600">.</span></span>
          </Link>

          <div className="max-w-lg py-16">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Welcome back</p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-[-0.055em] xl:text-6xl">
              Pick up the conversation where you left off.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Your next thoughtful introduction is only a few details away.
            </p>

            <ul className="mt-10 space-y-4">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-blue-700">
                    <CheckIcon className="size-4" />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-slate-400">Good outreach starts with a human touch.</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:py-12">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/90 bg-white/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-10">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
                <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white"><SparklesIcon className="size-4" /></span>
                ColdMail<span className="-ml-2 text-blue-600">.</span>
              </Link>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950">
                <ArrowLeftIcon className="size-4" /> Home
              </Link>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600">Your workspace is waiting</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Log in to ColdMail</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                New here? <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">Create a free account</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                  <span className="text-xs text-slate-400">Minimum 6 characters</span>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    minLength={6}
                    required
                    value={form.password}
                    onChange={updateField}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {submitting ? 'Logging you in…' : 'Log in'}
                {!submitting && <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to keep your account credentials secure.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
