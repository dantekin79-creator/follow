import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, SOCIALS } from '../config.js'
import SocialIcon from '../components/SocialIcon.jsx'

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  county: '',
  interest: '',
  consent: false,
}

function makeEntryCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return `SC-${out}`
}

export default function FollowPage() {
  const [followed, setFollowed] = useState({})
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [entryCode, setEntryCode] = useState('')
  const formRef = useRef(null)

  const followedCount = useMemo(
    () => SOCIALS.filter((s) => followed[s.key]).length,
    [followed],
  )
  const allFollowed = followedCount === SOCIALS.length
  const progress = Math.round((followedCount / SOCIALS.length) * 100)

  function handleFollow(social) {
    window.open(social.url, '_blank', 'noopener,noreferrer')
    setFollowed((prev) => {
      const next = { ...prev, [social.key]: true }
      if (SOCIALS.every((s) => next[s.key])) {
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 250)
      }
      return next
    })
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.'
    if (!/^[0-9+\s-]{9,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.county.trim()) next.county = 'Please tell us where you are based.'
    if (!form.consent) next.consent = 'Please accept the draw terms to enter.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return
    // NOTE: No backend integration yet — details are captured in the UI only.
    setEntryCode(makeEntryCode())
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="shell topbar__inner">
          <img className="logo-img" src={BRAND.logo} alt={BRAND.name} />
          <Link to="/qr" className="icon-btn topbar__spacer" aria-label="Show QR poster">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M20 20v.01M17 20v.01M20 17v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero__inner">
          <h1 className="reveal">
            Follow us.
            <br />
            <span className="grad">Win weekly.</span>
          </h1>
          <p className="lead reveal" style={{ animationDelay: '0.06s' }}>
            Follow all four Scoreline pages and complete the quick entry form to qualify
            for this week&apos;s giveaway. It takes under a minute.
          </p>
        </div>
      </section>

      <main className="shell">
        <div className="stack">
          {submitted ? (
            <div className="card card--lift reveal">
              <div className="thanks">
                <div className="thanks__badge">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12.5l4.2 4.2L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2>You&apos;re in the draw!</h2>
                <p className="lede">
                  Thank you, {form.fullName.split(' ')[0] || 'friend'}. You&apos;re now
                  qualified for this week&apos;s Scoreline draw. We&apos;ll reach you on the
                  number you provided if you&apos;re a winner.
                </p>

                <div className="ticket">
                  <div className="ticket__label">Your entry reference</div>
                  <div className="ticket__code">{entryCode}</div>
                  <div className="ticket__meta">
                    Keep this reference. Winners are announced every week.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ marginTop: 18 }}
                  onClick={() => window.location.reload()}
                >
                  Enter another participant
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1 — Follow */}
              <div className="card card--lift reveal" style={{ animationDelay: '0.18s' }}>
                <div className="step-head">
                  <span className={`step-num ${allFollowed ? 'step-num--done' : ''}`}>
                    {allFollowed ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M5 12.5l4.2 4.2L19 7"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      '1'
                    )}
                  </span>
                  <div>
                    <div className="step-title">Follow our pages</div>
                    <div className="step-hint">Tap each page to open and follow.</div>
                  </div>
                  <span className="count">
                    {followedCount}/{SOCIALS.length}
                  </span>
                </div>

                <div className="socials">
                  {SOCIALS.map((social) => {
                    const done = !!followed[social.key]
                    return (
                      <button
                        key={social.key}
                        type="button"
                        className={`social ${done ? 'is-done' : ''}`}
                        style={{ '--tint': social.tint }}
                        onClick={() => handleFollow(social)}
                      >
                        <span className="social__icon">
                          <SocialIcon name={social.key} />
                        </span>
                        <span className="social__meta">
                          <span className="social__label">{social.label}</span>
                          <span className="social__handle">{social.handle}</span>
                        </span>
                        <span className="social__tail">
                          {done ? (
                            <span className="social__check">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                  d="M5 12.5l4.2 4.2L19 7"
                                  stroke="currentColor"
                                  strokeWidth="3.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          ) : (
                            <span className="social__go">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                  d="M9 6l6 6-6 6"
                                  stroke="currentColor"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="progress">
                  <div className="progress__fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-note">
                  {allFollowed
                    ? 'All pages followed — complete the form below.'
                    : `Follow all ${SOCIALS.length} pages to unlock the entry form.`}
                </div>
              </div>

              {/* Step 2 — Enter */}
              <div className="card reveal" ref={formRef} style={{ animationDelay: '0.24s' }}>
                <div className="step-head">
                  <span className={`step-num ${allFollowed ? '' : 'step-num--muted'}`}>2</span>
                  <div>
                    <div className="step-title">Enter the weekly draw</div>
                    <div className="step-hint">Your details qualify your entry.</div>
                  </div>
                </div>

                {!allFollowed ? (
                  <div className="locked">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span>Follow all {SOCIALS.length} pages above to unlock the entry form.</span>
                  </div>
                ) : (
                  <form className="form" onSubmit={handleSubmit} noValidate>
                    <div className="field">
                      <label htmlFor="fullName">
                        Full name <span className="req">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Jane Wanjiru"
                        value={form.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                      />
                      {errors.fullName && <span className="err">{errors.fullName}</span>}
                    </div>

                    <div className="row-2">
                      <div className="field">
                        <label htmlFor="phone">
                          Phone number <span className="req">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="0712 345 678"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                        />
                        {errors.phone && <span className="err">{errors.phone}</span>}
                      </div>

                      <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="you@email.com"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                        />
                        {errors.email && <span className="err">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="row-2">
                      <div className="field">
                        <label htmlFor="county">
                          County / Location <span className="req">*</span>
                        </label>
                        <input
                          id="county"
                          type="text"
                          placeholder="e.g. Nairobi"
                          value={form.county}
                          onChange={(e) => update('county', e.target.value)}
                        />
                        {errors.county && <span className="err">{errors.county}</span>}
                      </div>

                      <div className="field">
                        <label htmlFor="interest">Insurance interest</label>
                        <select
                          id="interest"
                          value={form.interest}
                          onChange={(e) => update('interest', e.target.value)}
                        >
                          <option value="">Select (optional)</option>
                          <option>Motor</option>
                          <option>Medical / Health</option>
                          <option>Life</option>
                          <option>Home</option>
                          <option>Business</option>
                          <option>Travel</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <label className="consent">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update('consent', e.target.checked)}
                      />
                      <span>
                        I agree to the draw terms and consent to being contacted by{' '}
                        {BRAND.name} about the weekly draw and relevant offers.
                      </span>
                    </label>
                    {errors.consent && <span className="err">{errors.consent}</span>}

                    <button type="submit" className="btn btn--primary">
                      Enter the Weekly Draw
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M5 12h13M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="shell">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p style={{ marginTop: 6 }}>
            Questions? <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
