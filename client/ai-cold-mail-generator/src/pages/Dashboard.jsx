import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowPathIcon,
  BoltIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout.jsx'
import api from '../utils/api.js'
import { useAuth } from '../context/auth.context.jsx'

const outputTabs = [
  { key: 'emailBody', label: 'Cold email' },
  { key: 'linkedInDm', label: 'LinkedIn DM' },
  { key: 'followUpEmail', label: 'Follow-up' }
]

const examples = [
  'Pitch our analytics tool to a Head of Growth at a seed-stage SaaS company',
  'Offer website redesign services to a local fitness studio with an outdated site',
  'Introduce our recruiting service to a startup that is hiring five engineers'
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('emailBody')
  const [generating, setGenerating] = useState(false)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadHistory = async () => {
      try {
        const { data } = await api.get('/api/ai/history')
        setHistory(data)
      } catch (error) {
        if (error.response?.status === 401) {
          logout()
          navigate('/login', { replace: true })
        } else {
          toast.error(error.response?.data?.message || 'Could not load your history.')
        }
      } finally {
        setLoadingHistory(false)
      }
    }

    loadHistory()
  }, [logout, navigate, user])

  if (!user) return <Navigate to="/login" replace />

  const generateEmail = async (event) => {
    event.preventDefault()
    if (!prompt.trim()) {
      toast.error('Describe who you want to reach and what you offer.')
      return
    }

    setGenerating(true)
    try {
      const { data } = await api.post('/api/ai/generate', { prompt: prompt.trim() })
      setResult(data)
      setActiveTab('emailBody')
      setHistory((current) => [{ ...data, prompt: prompt.trim(), createdAt: new Date().toISOString(), _id: `new-${Date.now()}` }, ...current])
      toast.success('Your outreach is ready.')
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        navigate('/login', { replace: true })
      } else {
        toast.error(error.response?.data?.error || error.response?.data?.message || 'Could not generate outreach.')
      }
    } finally {
      setGenerating(false)
    }
  }

  const selectHistory = (item) => {
    setPrompt(item.prompt)
    setResult(item)
    setActiveTab('emailBody')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentContent = result?.[activeTab] || ''
  const copyResult = async () => {
    const content = activeTab === 'emailBody' ? `Subject: ${result.subject}\n\n${currentContent}` : currentContent
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy the text.')
    }
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="mx-auto max-w-7xl">
        <section id="create">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">Welcome back, {user.userName?.split(' ')[0] || 'there'}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">What should we write today?</h1>
              <p className="mt-2 text-sm text-slate-500">Give the AI enough context to make the message feel genuinely researched.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><BoltIcon className="size-4 text-amber-500" /> Usually ready in under 10 seconds</div>
          </div>

          <div className="mt-7 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <form onSubmit={generateEmail} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><SparklesIcon className="size-5" /></span>
                  <div><h2 className="text-sm font-bold">Describe your outreach</h2><p className="text-xs text-slate-400">More detail creates a better result</p></div>
                </div>
                <span className="text-xs text-slate-400">{prompt.length}/1000</span>
              </div>

              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value.slice(0, 1000))}
                rows={9}
                placeholder="Example: Write to the VP of Sales at a growing B2B SaaS company. We help sales teams automate CRM updates so reps can spend more time selling. Keep it warm and direct..."
                className="mt-5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Try an example</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {examples.map((example, index) => <button key={example} type="button" onClick={() => setPrompt(example)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Example {index + 1}</button>)}
                </div>
              </div>

              <button type="submit" disabled={generating} className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
                {generating ? <><ArrowPathIcon className="size-5 animate-spin" /> Writing your outreach…</> : <><SparklesIcon className="size-5" /> Generate outreach</>}
              </button>
            </form>

            <div className="flex min-h-[520px] flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              {result ? (
                <>
                  <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
                    <div><p className="text-xs font-semibold text-emerald-600">Ready to use</p><h2 className="mt-1 text-lg font-bold">Your generated outreach</h2></div>
                    <button type="button" onClick={copyResult} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                      {copied ? <CheckIcon className="size-4 text-emerald-600" /> : <ClipboardDocumentIcon className="size-4" />}{copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                    {outputTabs.map((tab) => <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${activeTab === tab.key ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{tab.label}</button>)}
                  </div>

                  <div className="mt-5 flex-1 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                    {activeTab === 'emailBody' && <div className="mb-5 border-b border-slate-200 pb-4"><span className="font-semibold text-slate-400">Subject: </span><span className="font-bold text-slate-900">{result.subject}</span></div>}
                    <p className="whitespace-pre-wrap">{currentContent}</p>
                  </div>
                </>
              ) : (
                <div className="m-auto max-w-sm text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-slate-100 text-slate-400"><PaperAirplaneIcon className="size-8" /></span>
                  <h2 className="mt-5 text-lg font-bold">Your draft will appear here</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Describe your prospect and offer, then generate a cold email, LinkedIn message, and follow-up in one go.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="history" className="mt-10 pb-10">
          <div className="flex items-end justify-between">
            <div><p className="text-sm font-semibold text-blue-600">Your library</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.035em]">Recent generations</h2></div>
            <span className="text-xs text-slate-400">{history.length} saved</span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            {loadingHistory ? (
              <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400"><ArrowPathIcon className="size-5 animate-spin" /> Loading history…</div>
            ) : history.length ? (
              <div className="divide-y divide-slate-100">
                {history.slice(0, 8).map((item) => (
                  <button key={item._id} type="button" onClick={() => selectHistory(item)} className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><DocumentTextIcon className="size-5" /></span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{item.subject}</p><p className="mt-1 truncate text-xs text-slate-400">{item.prompt}</p></div>
                    <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex"><ClockIcon className="size-4" />{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-14 text-center"><ClockIcon className="mx-auto size-7 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">No generations yet</p><p className="mt-1 text-xs text-slate-400">Your saved outreach will show up here.</p></div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Dashboard
