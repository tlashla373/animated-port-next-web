'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CAPTCHA_A = 1
const CAPTCHA_B = 7

export default function FloatingCTA() {
  const [visible, setVisible]     = useState(false)
  const [open, setOpen]           = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const [fields, setFields] = useState({
    name: '', email: '', subject: '', message: '', captcha: '',
  })

  useEffect(() => {
    setVisible(true)
    const onScroll = () => setVisible(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function set(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields(f => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (parseInt(fields.captcha, 10) !== CAPTCHA_A + CAPTCHA_B) {
      setError('Incorrect answer. Please try again.')
      return
    }
    // TODO: wire to your email API / form service
    setSubmitted(true)
  }

  function handleClose() {
    setOpen(false)
    setTimeout(() => { setSubmitted(false); setError(''); setFields({ name:'', email:'', subject:'', message:'', captcha:'' }) }, 400)
  }

  const inputCls = 'w-full bg-white/5 border border-white/15 focus:border-[#C9B99A]/70 outline-none rounded-lg px-4 py-2.5 text-[0.8rem] text-white placeholder:text-white/30 transition-colors duration-200'
  const labelCls = 'block text-[0.65rem] tracking-[0.18em] uppercase text-white/50 mb-1.5'

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && !open && (
          <div style={{ position: 'fixed', bottom: '2rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 999, pointerEvents: 'none' }}>
            <motion.button
              key="floating-cta"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Get a Quote"
              style={{ pointerEvents: 'auto' }}
              className="flex items-center gap-2.5 bg-[#fcfcfc] hover:bg-[#0d4a7e] border border-[#C9B99A]/40 hover:border-[#C9B99A]/80 text-[#C9B99A] text-[0.68rem] font-semibold tracking-[0.22em] uppercase px-5 py-3 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.55)] transition-colors duration-300"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="5" r="3"/>
                <line x1="12" y1="8" x2="12" y2="22"/>
                <path d="M5 15H2a10 10 0 0 0 20 0h-3"/>
              </svg>
              Get a Quote
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* ── Backdrop + slide-up form ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
              className="bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1001 }}
              className="bg-[#071e34] border-t border-white/10 rounded-t-2xl px-6 md:px-10 pt-8 pb-10 max-h-[92dvh] overflow-y-auto"
            >
              {/* Handle bar */}
              <div className="mx-auto w-10 h-1 rounded-full bg-white/20 mb-7" />

              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[0.62rem] tracking-[0.4em] uppercase text-[#C9B99A] mb-1">Royal Asia Shipping</p>
                  <h2 className="text-xl md:text-2xl font-light text-white tracking-tight">Send Us a Message</h2>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="text-white/30 hover:text-white/70 transition-colors mt-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 py-12 text-center"
                  >
                    <div className="w-12 h-12 rounded-full border border-[#C9B99A]/50 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9B99A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="text-white text-base font-light">Message sent successfully.</p>
                    <p className="text-white/40 text-[0.75rem]">We will get back to you within 24 hours.</p>
                    <button onClick={handleClose} className="mt-4 text-[0.68rem] tracking-[0.22em] uppercase text-[#C9B99A] border border-[#C9B99A]/40 px-5 py-2.5 rounded-full hover:border-[#C9B99A]/80 transition-colors">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {/* Name */}
                    <div>
                      <label className={labelCls}>Name <span className="text-[#C9B99A]">*</span></label>
                      <input required value={fields.name} onChange={set('name')} placeholder="Your full name" className={inputCls} />
                    </div>

                    {/* E-Mail */}
                    <div>
                      <label className={labelCls}>E-Mail <span className="text-[#C9B99A]">*</span></label>
                      <input required type="email" value={fields.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} />
                    </div>

                    {/* Subject */}
                    <div className="md:col-span-2">
                      <label className={labelCls}>Subject <span className="text-[#C9B99A]">*</span></label>
                      <input required value={fields.subject} onChange={set('subject')} placeholder="How can we help?" className={inputCls} />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                      <label className={labelCls}>Message <span className="text-[#C9B99A]">*</span></label>
                      <textarea required rows={4} value={fields.message} onChange={set('message')} placeholder="Tell us about your shipment requirements…" className={`${inputCls} resize-none`} />
                    </div>

                    {/* Captcha */}
                    <div>
                      <label className={labelCls}>
                        {CAPTCHA_A} + {CAPTCHA_B} = ? &nbsp;
                        <span className="text-white/30 normal-case tracking-normal">Please prove you are human</span>
                        <span className="text-[#C9B99A]"> *</span>
                      </label>
                      <input required value={fields.captcha} onChange={set('captcha')} inputMode="numeric" placeholder="Your answer" className={inputCls} />
                      {error && <p className="text-red-400 text-[0.7rem] mt-2">{error}</p>}
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-end mt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2.5 bg-[#0b3d68] hover:bg-[#0d4a7e] border border-[#C9B99A]/40 hover:border-[#C9B99A]/80 text-[#C9B99A] text-[0.68rem] font-semibold tracking-[0.22em] uppercase px-6 py-3 rounded-full transition-colors duration-200"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Send Message
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

