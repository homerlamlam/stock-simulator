interface StateNoticeProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  tone?: 'neutral' | 'warning' | 'danger'
}

export function StateNotice({ actionLabel, message, onAction, title, tone = 'neutral' }: StateNoticeProps) {
  return (
    <div className={getClassName(tone)}>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6">{message}</p>
      </div>
      {actionLabel && onAction ? (
        <button
          className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-fit"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

function getClassName(tone: StateNoticeProps['tone']): string {
  const baseClassName = 'rounded-lg border p-4'

  if (tone === 'danger') {
    return `${baseClassName} border-red-100 bg-red-50 text-red-800`
  }

  if (tone === 'warning') {
    return `${baseClassName} border-amber-100 bg-amber-50 text-amber-800`
  }

  return `${baseClassName} border-orange-100 bg-orange-50 text-orange-800`
}
