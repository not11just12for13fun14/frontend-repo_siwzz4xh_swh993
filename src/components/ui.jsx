import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Loader2 } from 'lucide-react'

export function Header({ title, onBack, right }) {
  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-2">
        {onBack ? (
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <ChevronLeft size={20} />
          </button>
        ) : null}
        <h1 className="font-semibold text-slate-800 text-lg">{title}</h1>
        <div className="ml-auto">{right}</div>
      </div>
    </div>
  )
}

export function Button({ children, className = '', variant = 'primary', loading = false, ...props }) {
  const styles = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
  }[variant]
  return (
    <button
      className={`h-11 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${styles} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </button>
  )
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm text-slate-600 mb-1">{label}</div>}
      <input
        className={`w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white ${className}`}
        {...props}
      />
    </label>
  )
}

export function Textarea({ label, className = '', rows = 4, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm text-slate-600 mb-1">{label}</div>}
      <textarea
        rows={rows}
        className={`w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white ${className}`}
        {...props}
      />
    </label>
  )
}

export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick} className={`rounded-2xl border border-slate-200 bg-white p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 flex items-center"><div className="font-semibold text-slate-800">{title}</div></div>
            <div className="p-4">{children}</div>
            {footer && <div className="p-4 border-t border-slate-200">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-md mx-auto h-16 grid grid-cols-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => onChange(t.key)} className={`flex flex-col items-center justify-center gap-1 text-xs ${active === t.key ? 'text-sky-600' : 'text-slate-500'}`}>
            {<t.icon size={22} />}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Empty({ title = 'Nothing here yet', subtitle }) {
  return (
    <div className="text-center text-slate-500 py-10">
      <div className="font-medium">{title}</div>
      {subtitle && <div className="text-sm mt-1">{subtitle}</div>}
    </div>
  )
}
