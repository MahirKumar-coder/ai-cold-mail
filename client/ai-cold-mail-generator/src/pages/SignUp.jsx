import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

const benefits = [
  'Generate personalized outreach in seconds',
  'Keep every draft natural and on-brand',
  'Turn more introductions into conversations'
]

const SignUp = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ userName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const updateField = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await api.post('/auth/register', {
        userName: form.userName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      })

      sessionStorage.setItem('verificationEmail', form.email.trim().toLowerCase())
      toast.success(data.message || 'Account created. Check your email for the OTP.')
      navigate('/verify-otp', { state: { email: form.email.trim().toLowerCase() } })
    } catch (error) {
      const message = error.response?.data?.message
        || (error.request
          ? 'Cannot reach the server. Make sure the backend is running.'
          : 'Could not create your account. Please try again.')
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(52,211,153,0.12),transparent_25%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.16),transparent_28%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between p-12 lg:flex xl:p-16">
          <Link to="/" className="flex w-fit items-center gap-3" aria-label="ColdMail home">
            <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
              <SparklesIcon className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">ColdMail<span className="text-blue-600">.</span></span>
          </Link>

          <div className="max-w-lg py-16">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Make the first message count</p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-[-0.055em] xl:text-6xl">
              Better outreach starts with better context.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Create an account and turn a few useful details into a cold email worth replying to.
            </p>

            <ul className="mt-10 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckIcon className="size-4" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-slate-400">Thoughtful emails. More human conversations.</p>
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
              <p className="text-sm font-semibold text-blue-600">Start for free</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Create your account</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Log in</Link></p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="userName" className="mb-2 block text-sm font-semibold text-slate-700">Your name</label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.userName}
                  onChange={updateField}
                  placeholder="Alex Morgan"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={updateField}
                  placeholder="alex@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      value={form.password}
                      onChange={updateField}
                      placeholder="6+ characters"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 transition hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={form.confirmPassword}
                    onChange={updateField}
                    placeholder="Repeat password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm leading-6 text-slate-500">
                <input type="checkbox" required className="mt-1 size-4 rounded border-slate-300 accent-blue-600" />
                <span>I agree to the <a href="#terms" className="font-semibold text-slate-700 hover:text-blue-600">Terms</a> and <a href="#privacy" className="font-semibold text-slate-700 hover:text-blue-600">Privacy Policy</a>.</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {submitting ? 'Creating your account…' : 'Create account'}
                {!submitting && <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">We’ll email you a 6-digit code to verify your account.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SignUp
