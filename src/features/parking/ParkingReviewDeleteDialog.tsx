import trashBigIcon from '../../assets/icons/trash-big.svg'
import { getParkingMessages, type SupportedLocale } from '../../constants/parkingI18n'

type ParkingReviewDeleteDialogProps = {
  cancelLabel?: string
  confirmLabel?: string
  error?: string | null
  isDeleting?: boolean
  loadingLabel?: string
  locale: SupportedLocale
  onCancel: () => void
  onConfirm: () => Promise<void> | void
  subtitle?: string
  title?: string
}

export function ParkingReviewDeleteDialog({
  cancelLabel,
  confirmLabel,
  error = null,
  isDeleting = false,
  loadingLabel,
  locale,
  onCancel,
  onConfirm,
  subtitle,
  title,
}: ParkingReviewDeleteDialogProps) {
  const messages = getParkingMessages(locale)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 p-6 backdrop-blur-[3px]">
      <section
        aria-modal="true"
        className="flex w-full max-w-[21.5rem] flex-col items-center gap-6 rounded-xl bg-surface px-4 py-10 shadow-[0_16px_48px_rgb(0_0_0_/_0.18)] sm:px-5"
        role="dialog"
      >
          <img alt="" aria-hidden="true" className="size-20" src={trashBigIcon} />
        <div className="flex w-full max-w-[18.5rem] flex-col items-center gap-2">
          <h2 className="text-center font-heading text-xl leading-7 font-medium text-text-primary">
            {title ?? messages.deleteReviewDialogTitle}
          </h2>
          <p className="text-center font-heading text-base leading-5 font-normal text-text-secondary">
            {subtitle ?? messages.deleteReviewDialogSubtitle}
          </p>
        </div>
        <div className="flex w-full gap-2">
          <button
            className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#E5E7EB] px-6 font-heading text-base leading-6 font-medium tracking-tight text-primary transition hover:bg-[#DDE3EA]"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel ?? messages.deleteReviewDialogCancel}
          </button>
          <button
            className="flex h-14 flex-1 items-center justify-center rounded-xl bg-[#FF5F57] px-6 font-heading text-base leading-6 font-medium tracking-tight text-white transition hover:bg-[#f4534b]"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting
              ? loadingLabel ?? messages.loading
              : confirmLabel ?? messages.deleteReviewDialogConfirm}
          </button>
        </div>
        {error ? (
          <p className="px-4 text-center font-heading text-sm leading-5 font-normal text-danger">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  )
}
