import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import api from '../utils/api.js'

const VerifyOTP = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const inputRefs = useRef([])
  const savedEmail = location.state?.email || sessionStorage.getItem('verificationEmail') || ''
  const [email, setEmail] = useState(savedEmail)
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [submitting, setSubmitting] = useState(false)

  const updateDigit = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item))

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    if (!pastedDigits.length) return

    setDigits(Array.from({ length: 6 }, (_, index) => pastedDigits[index] || ''))
    inputRefs.current[Math.min(pastedDigits.length, 6) - 1]?.focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const otp = digits.join('')
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      toast.error('Enter the email address used to sign up.')
      return
    }

    if (otp.length !== 6) {
      toast.error('Enter the complete 6-digit code.')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await api.post('/auth/verify-otp', { email: normalizedEmail, otp })
      sessionStorage.removeItem('verificationEmail')
      toast.success(data.message || 'Email verified successfully!')
      navigate('/login', { replace: true, state: { verified: true } })
    } catch (error) {
      console.error('OTP verification error details:', error)
      const message = error.response?.data?.message
        || (error.request
          ? 'Cannot reach the server. Make sure the backend is running and the API URL is configured correctly.'
          : 'Could not verify the code. Please try again.')

      if (message.toLowerCase().includes('already verified')) {
        sessionStorage.removeItem('verificationEmail')
        toast.success('Your email is already verified. You can log in.')
        navigate('/login', { replace: true })
      } else {
        toast.error(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(52,211,153,0.10),transparent_25%)]" />

      <header className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="ColdMail home">
          <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
            <SparklesIcon className="size-5" />
          </span>
          <span className="text-xl font-bold tracking-[-0.04em]">ColdMail<span className="text-blue-600">.</span></span>
        </Link>
        <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-950">
          <ArrowLeftIcon className="size-4" /> Back to signup
        </Link>
      </header>

      <section className="relative mx-auto flex max-w-7xl items-center justify-center px-5 pb-16 pt-8 sm:px-8 sm:pt-14 lg:px-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/90 bg-white/90 p-6 text-center shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-10">
          <div className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/25">
            <EnvelopeIcon className="size-8" />
            <span className="absolute -bottom-1.5 -right-1.5 grid size-7 place-items-center rounded-full border-4 border-white bg-emerald-500">
              <ShieldCheckIcon className="size-3.5" />
            </span>
          </div>

          <p className="mt-7 text-sm font-semibold text-blue-600">One quick security check</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Verify your email</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            We sent a six-digit verification code to your inbox. Enter it below to activate your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 text-left">
            <div>
              <label htmlFor="verification-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input
                id="verification-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <fieldset className="mt-6">
              <legend className="mb-3 block text-sm font-semibold text-slate-700">Verification code</legend>
              <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { inputRefs.current[index] = element }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    aria-label={`Digit ${index + 1} of verification code`}
                    className="aspect-square min-w-0 rounded-xl border border-slate-200 bg-white text-center text-xl font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:rounded-2xl sm:text-2xl"
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">The code expires 10 minutes after it was sent.</p>
            </fieldset>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              {submitting ? 'Verifying your code…' : 'Verify email'}
              {!submitting && <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-7 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-left">
            <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <p className="text-xs leading-5 text-emerald-800">
              Didn’t receive the email? Check your spam folder or return to signup to request a fresh code.
            </p>
          </div>

          <p className="mt-7 text-sm text-slate-500">
            Already verified? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default VerifyOTP
