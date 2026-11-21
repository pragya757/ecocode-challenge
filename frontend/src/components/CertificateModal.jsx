import { useRef } from 'react'
import { Award, Download, Share2, X, CheckCircle2, ShieldCheck, Leaf, Sparkles, ExternalLink } from 'lucide-react'

export default function CertificateModal({ user, onClose }) {
  const certRef = useRef(null)

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Deterministic certificate ID based on user id
  const certId = `ECO-${String(user?.id || 1).padStart(4, '0')}-${new Date().getFullYear()}`

  const downloadCertificate = () => {
    if (!certRef.current) return
    const svgElement = certRef.current
    const svgString = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const URL = window.URL || window.webkitURL || window
    const blobURL = URL.createObjectURL(svgBlob)

    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1600
      canvas.height = 1130
      const context = canvas.getContext('2d')
      context.fillStyle = '#0f172a'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const png = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `EcoCode-Certificate-${user?.full_name?.replace(/\s+/g, '_') || 'Developer'}.png`
      downloadLink.href = png
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
    image.src = blobURL
  }

  const shareText = encodeURIComponent(
    `🌱 I just earned my Certified Green Software Engineer credential on EcoCode Challenge! I've mastered energy-efficient algorithmic design, memory optimization, and carbon-aware computing.\n\n#GreenCoding #SustainableSoftware #EcoCode`
  )
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?text=${shareText}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Official Credential
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Certified Green Software Engineer
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Verified achievement in sustainable computation and green algorithms
          </p>
        </div>

        {/* Scalable SVG Certificate Graphic */}
        <div className="rounded-2xl border-2 border-emerald-500/40 p-2 bg-gradient-to-br from-emerald-950/40 to-slate-950 shadow-inner">
          <svg
            ref={certRef}
            viewBox="0 0 800 565"
            className="w-full h-auto rounded-xl select-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {/* Background */}
            <rect width="800" height="565" fill="#09131f" rx="12" />
            <rect x="20" y="20" width="760" height="525" fill="#0b1a2b" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" rx="8" />
            <rect x="30" y="30" width="740" height="505" fill="none" stroke="#059669" strokeWidth="1" rx="6" />

            {/* Corner Leaf Accents */}
            <circle cx="50" cy="50" r="14" fill="#10b981" fillOpacity="0.15" />
            <circle cx="750" cy="50" r="14" fill="#10b981" fillOpacity="0.15" />
            <circle cx="50" cy="515" r="14" fill="#10b981" fillOpacity="0.15" />
            <circle cx="750" cy="515" r="14" fill="#10b981" fillOpacity="0.15" />

            {/* Top Brand & Seal */}
            <g transform="translate(400, 75)">
              <circle cx="0" cy="0" r="28" fill="#15803d" />
              <path d="M-8 -6 C-2 -18 16 -12 12 8 C6 18 -12 12 -8 -6 Z" fill="#a3e635" />
              <text x="0" y="44" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="800" letterSpacing="3">
                ECOCODE CHALLENGE
              </text>
              <text x="0" y="58" textAnchor="middle" fill="#94a3b8" fontSize="9" letterSpacing="1.5">
                FOUNDATION FOR SUSTAINABLE COMPUTATION
              </text>
            </g>

            {/* Title */}
            <text x="400" y="180" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="900" letterSpacing="1">
              CERTIFICATE OF RECOGNITION
            </text>
            <text x="400" y="202" textAnchor="middle" fill="#6ee7b7" fontSize="11" letterSpacing="2" fontWeight="700">
              THIS CERTIFIES THAT
            </text>

            {/* Recipient Name */}
            <text x="400" y="248" textAnchor="middle" fill="#f8fafc" fontSize="26" fontWeight="900">
              {user?.full_name || 'Sustainable Developer'}
            </text>
            <line x1="220" y1="262" x2="580" y2="262" stroke="#10b981" strokeWidth="2" strokeOpacity="0.8" />

            {/* Body Description */}
            <text x="400" y="295" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="400">
              has demonstrated distinguished competency in Green Software Engineering,
            </text>
            <text x="400" y="313" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="400">
              mastering algorithmic efficiency, memory optimization, and carbon-aware architecture.
            </text>

            {/* EcoPoints Badge */}
            <g transform="translate(400, 360)">
              <rect x="-80" y="-14" width="160" height="28" rx="14" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill="#a3e635" fontSize="11" fontWeight="800">
                🌿 {user?.total_points || 0} ECOPOINTS EARNED
              </text>
            </g>

            {/* Signatures & Seal */}
            <g transform="translate(180, 445)">
              <line x1="-70" y1="0" x2="70" y2="0" stroke="#475569" strokeWidth="1" />
              <text x="0" y="-8" textAnchor="middle" fill="#34d399" fontStyle="italic" fontSize="13" fontFamily="cursive">
                Dr. E. Lovelace
              </text>
              <text x="0" y="14" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="700">
                DR. ELENA LOVELACE
              </text>
              <text x="0" y="25" textAnchor="middle" fill="#64748b" fontSize="8">
                Lead Green Architect
              </text>
            </g>

            {/* Gold Seal Center */}
            <g transform="translate(400, 445)">
              <circle cx="0" cy="0" r="26" fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="0" cy="0" r="20" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
              <text x="0" y="4" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="900">
                VERIFIED
              </text>
            </g>

            <g transform="translate(620, 445)">
              <line x1="-70" y1="0" x2="70" y2="0" stroke="#475569" strokeWidth="1" />
              <text x="0" y="-8" textAnchor="middle" fill="#34d399" fontStyle="italic" fontSize="13" fontFamily="cursive">
                A. Turing
              </text>
              <text x="0" y="14" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="700">
                ECOCODE GOVERNANCE
              </text>
              <text x="0" y="25" textAnchor="middle" fill="#64748b" fontSize="8">
                Foundation Director
              </text>
            </g>

            {/* Footer Metadata */}
            <text x="50" y="515" fill="#64748b" fontSize="9">
              Issue Date: {issueDate}
            </text>
            <text x="750" y="515" textAnchor="end" fill="#64748b" fontSize="9">
              Certificate ID: {certId}
            </text>
          </svg>
        </div>

        {/* Actions Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically verifiable badge ID: <strong className="text-slate-200">{certId}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5 bg-blue-900/30 text-blue-300 border-blue-700/50 hover:bg-blue-800/40"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on LinkedIn</span>
            </a>

            <button
              onClick={downloadCertificate}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
