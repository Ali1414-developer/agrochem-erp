import { useState } from 'react'
import { X, Eye } from 'lucide-react'

export default function ProfileHeader({ user, avatar, onAvatarChange }) {
  const [showModal, setShowModal] = useState(false)

  const initials = (user?.fullName || 'Admin')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <div className="rounded-4xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-emerald-50/70 p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Clickable Avatar Button */}
            <div className="relative group shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-600/30 bg-emerald-50 text-3xl font-extrabold text-emerald-700 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-600 group-hover:ring-4 group-hover:ring-emerald-500/20 focus:outline-none cursor-pointer"
                title="Click to view full picture"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile avatar" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Eye className="h-7 w-7 text-white drop-shadow-md" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-0.5">View</span>
                </div>
              </button>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin profile</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 truncate">{user?.fullName || 'System Administrator'}</h2>
              <p className="mt-1 text-sm text-slate-500 truncate">{user?.email || 'admin@erp.com'}</p>
            </div>
          </div>

          <label className="inline-flex w-full cursor-pointer justify-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto">
            <span>Upload avatar</span>
            <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Lightbox Modal for Full Picture View */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-xl w-full rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{user?.fullName || 'System Administrator'}</h3>
                <p className="text-xs text-slate-400">Full resolution picture</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image display */}
            <div className="mt-6 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 p-2 border border-slate-800">
              {avatar ? (
                <img
                  src={avatar}
                  alt={user?.fullName || 'Full profile picture'}
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-full bg-emerald-800/50 border-4 border-emerald-500/40 text-6xl font-extrabold text-emerald-200">
                  {initials}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
