import { useState } from 'react'
import api from '../services/api'
import {
  Globe2, Leaf, Zap, ShieldCheck, AlertTriangle, ArrowRight,
  TrendingDown, Smartphone, Car, TreePine, Sparkles, RefreshCw,
  CheckCircle2, FileText, Database, HardDrive, Cpu, ExternalLink
} from 'lucide-react'

export default function CarbonInspector() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAudit = async (targetUrl) => {
    const queryUrl = targetUrl || url
    if (!queryUrl.trim()) {
      setError('Please enter a website URL.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setResult(null)
      const res = await api.post('/carbon-inspector/audit', { url: queryUrl })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan website. Please verify the URL is accessible.')
    } finally {
      setLoading(false)
    }
  }

  const sampleUrls = [
    { name: 'Wikipedia', url: 'https://en.wikipedia.org', badge: 'Ultra Green' },
    { name: 'GitHub', url: 'https://github.com', badge: 'Developer Hub' },
    { name: 'Google', url: 'https://www.google.com', badge: 'Minimal' },
    { name: 'BBC News', url: 'https://www.bbc.com', badge: 'Media' },
  ]

  const getGradeBadge = (grade) => {
    switch (grade) {
      case 'A+':
        return 'bg-emerald-500 text-white shadow-emerald-500/30'
      case 'A':
        return 'bg-green-600 text-white shadow-green-600/30'
      case 'B':
        return 'bg-lime-500 text-slate-950 shadow-lime-500/30'
      case 'C':
        return 'bg-amber-500 text-slate-950 shadow-amber-500/30'
      case 'D':
        return 'bg-orange-500 text-white shadow-orange-500/30'
      default:
        return 'bg-rose-600 text-white shadow-rose-600/30'
    }
  }

  return (
    <div className="container-custom py-8 md:py-12 space-y-10 page-enter">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3 border border-emerald-200 dark:border-emerald-800">
          <Leaf className="w-3.5 h-3.5" /> Sustainable Web Design (SWD) Scanner
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Website Carbon Inspector
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          Audit the real-world carbon footprint of any website or cloud API endpoint. Measures payload weight, queries The Green Web Foundation, and computes environmental impact ratings.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAudit()
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter domain (e.g. greenweb.org or https://your-site.com)..."
              className="input-field pl-11 py-3 text-sm md:text-base font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 px-8 text-sm md:text-base flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Inspect Carbon</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-500 font-medium">Try Sample Sites:</span>
          {sampleUrls.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => {
                setUrl(s.url)
                handleAudit(s.url)
              }}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 font-medium"
            >
              {s.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading State Banner */}
      {loading && (
        <div className="card p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              Conducting Sustainable Web Audit...
            </h3>
            <p className="text-xs text-slate-400">
              Measuring HTTP payloads, verifying renewable energy certifications, and modeling carbon intensity.
            </p>
          </div>
        </div>
      )}

      {/* Audit Result Display */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Grade Banner Card */}
          <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-lg ${getGradeBadge(result.grade.grade)}`}>
                  {result.grade.grade}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> EcoCode Score: {result.grade.desc}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                    {result.hostname}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Scanned at {result.latency_ms}ms latency • HTTP {result.status_code} Status
                  </p>
                </div>
              </div>

              {/* Carbon Emission Counter */}
              <div className="text-left md:text-right bg-black/30 p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-black text-emerald-400">
                  {result.grams_co2}g <span className="text-xs text-slate-300 font-semibold">CO₂ / pageview</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ~{result.annual_co2_kg} kg CO₂ / year (10k monthly visitors)
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* 1. Transferred Payload */}
            <div className="card p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payload Size</span>
                <HardDrive className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {result.kb_transferred} <span className="text-xs font-semibold text-slate-400">KB</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {result.is_compressed ? `Compressed via ${result.encoding}` : 'Uncompressed payload'}
              </p>
            </div>

            {/* 2. Renewable Energy Host */}
            <div className="card p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clean Hosting</span>
                <Leaf className={`w-4 h-4 ${result.green_host.green ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {result.green_host.green ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Green Certified</span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300">Standard Grid</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate" title={result.green_host.hosted_by}>
                Provider: {result.green_host.hosted_by}
              </p>
            </div>

            {/* 3. HTTP Compression */}
            <div className="card p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compression</span>
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {result.is_compressed ? 'Enabled' : 'Missing'}
              </div>
              <p className="text-[11px] text-slate-500">
                {result.is_compressed ? `Encoding: ${result.encoding}` : 'Brotli / Gzip recommended'}
              </p>
            </div>

            {/* 4. Cache Efficiency */}
            <div className="card p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Caching Policy</span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {result.has_caching ? 'Configured' : 'Suboptimal'}
              </div>
              <p className="text-[11px] text-slate-500">
                {result.has_caching ? 'Cache headers present' : 'No Cache-Control header'}
              </p>
            </div>
          </div>

          {/* Real-World Equivalents Scale */}
          <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" /> Real-World Environmental Equivalence
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Translating digital bits and compute cycles into physical carbon equivalents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {result.equivalents.smartphone_charges}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Smartphone battery charges</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {result.equivalents.car_meters_driven}m
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Driven in a standard gasoline car</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {result.equivalents.trees_needed_annual} Trees
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Needed annually to absorb emissions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Green Recommendations */}
          <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Actionable Green Optimization Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Specific architectural and devops adjustments to reduce this site's energy profile.
              </p>
            </div>

            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all ${
                    rec.severity === 'high'
                      ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20'
                      : rec.severity === 'medium'
                      ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20'
                      : rec.severity === 'optimal'
                      ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rec.severity === 'high'
                            ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                            : rec.severity === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                            : rec.severity === 'optimal'
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {rec.severity} priority
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                        {rec.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
