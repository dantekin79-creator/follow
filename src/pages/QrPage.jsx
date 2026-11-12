import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'
import { BRAND, ENTRY_PATH, PUBLIC_BASE_URL, SOCIALS } from '../config.js'

/** Deployed base the QR always points to. Falls back to the current origin. */
function fixedBase() {
  if (PUBLIC_BASE_URL) return PUBLIC_BASE_URL.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export default function QrPage() {
  const [copied, setCopied] = useState(false)

  // Hash routing keeps deep links working on GitHub Pages.
  const targetUrl = useMemo(() => `${fixedBase()}/#${ENTRY_PATH}`, [])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="page">
      <header className="topbar no-print">
        <div className="shell topbar__inner">
          <img className="logo-img" src={BRAND.logo} alt={BRAND.name} />
          <Link to={ENTRY_PATH} className="icon-btn topbar__spacer" aria-label="Back to entry page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </header>

      <main className="shell section" style={{ paddingTop: 26, paddingBottom: 44 }}>
        <div className="qr-wrap reveal">
          <div className="qr-eyebrow">Scoreline Weekly Draw</div>
          <h2 className="qr-heading">Scan to Follow &amp; Win</h2>
          <p className="qr-sub">
            Print this poster and display it in-store or on your flyers. Scanning the code
            opens the entry page.
          </p>

          <div className="qr-frame">
            <QRCodeSVG
              value={targetUrl}
              size={230}
              level="M"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#0a3272"
            />
          </div>

          <div className="qr-url">{targetUrl}</div>

          <div className="qr-chips">
            {SOCIALS.map((social) => (
              <span className="chip" key={social.key}>
                <span className="chip__dot" style={{ background: social.tint }} />
                {social.label}
              </span>
            ))}
          </div>

          <p className="qr-note" style={{ marginTop: 16 }}>
            Follow all {SOCIALS.length} pages, fill the entry form and qualify for the
            weekly draw.
          </p>

          <div className="qr-actions no-print">
            <button type="button" className="btn btn--primary" onClick={() => window.print()}>
              Print Poster
            </button>
            <button type="button" className="btn btn--ghost" onClick={copyLink}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <Link to={ENTRY_PATH} className="qr-link no-print">
            Preview the entry page →
          </Link>
        </div>
      </main>
    </div>
  )
}
