import { useState } from 'react'
import { Copy, Check, ExternalLink, Shield, CreditCard, Sparkles, Github } from 'lucide-react'

export default function GithubBadgeGenerator({ user }) {
  const [badgeStyle, setBadgeStyle] = useState('card') // 'card' | 'shield'
  const [copiedFormat, setCopiedFormat] = useState(null)

  // Determine base URL (in dev use window.location.origin or fallback to Render production URL)
  const origin = window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://ecocode-challenge.onrender.com'

  const userId = user?.id || 1
  const badgeUrl = `${origin}/api/profile/badge/${userId}?style=${badgeStyle}`
  const profileUrl = origin

  // Embed Snippets
  const snippets = {
    markdown: `[![EcoCode Green Developer](${badgeUrl})](${profileUrl})`,
    html: `<a href="${profileUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${badgeUrl}" alt="EcoCode Verified Green Developer" />\n</a>`,
    url: badgeUrl
  }

  const handleCopy = (format, text) => {
    navigator.clipboard.writeText(text)
    setCopiedFormat(format)
    setTimeout(() => setCopiedFormat(null), 2500)
  }

  return (
    <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Github className="w-5 h-5 text-emerald-500" />
              GitHub README Eco-Badge Generator
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
              Live SVG
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Display your verified green software engineering stats and current level on your GitHub Profile README.
          </p>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setBadgeStyle('card')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              badgeStyle === 'card'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Developer Card</span>
          </button>
          <button
            onClick={() => setBadgeStyle('shield')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              badgeStyle === 'shield'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Compact Shield</span>
          </button>
        </div>
      </div>

      {/* Live Badge Preview Area */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden group">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 select-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" /> Live Vector Preview
        </div>

        {/* Live SVG image rendered from backend */}
        <div className="transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={`/api/profile/badge/${userId}?style=${badgeStyle}&t=${Date.now()}`}
            alt="EcoCode Badge Preview"
            className="rounded-xl shadow-lg shadow-emerald-950/10 max-w-full h-auto"
          />
        </div>

        <a
          href={badgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Open raw SVG in new tab</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Snippet Embed Boxes */}
      <div className="space-y-4">
        {/* Markdown Snippet (Default for GitHub) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Markdown</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                Recommended for GitHub Profile README.md
              </span>
            </span>
            <button
              onClick={() => handleCopy('markdown', snippets.markdown)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
            >
              {copiedFormat === 'markdown' ? (
                <>
                  <Check className="w-3.5 h-3.5" /> <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
              {snippets.markdown}
            </pre>
          </div>
        </div>

        {/* HTML & Direct URL Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* HTML */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">HTML</span>
              <button
                onClick={() => handleCopy('html', snippets.html)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
              >
                {copiedFormat === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'html' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
              {snippets.html}
            </pre>
          </div>

          {/* Direct URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Raw SVG Endpoint</span>
              <button
                onClick={() => handleCopy('url', snippets.url)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
              >
                {copiedFormat === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
              {snippets.url}
            </pre>
          </div>
        </div>
      </div>

      {/* Guide Note */}
      <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>How to use:</strong> Open your GitHub profile repository (<code>github.com/your-username/your-username</code>), edit your <code>README.md</code>, paste the Markdown snippet, and commit. Your badge will automatically update whenever you level up or earn new EcoPoints!
        </p>
      </div>
    </div>
  )
}
