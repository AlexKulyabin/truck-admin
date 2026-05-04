import { X } from 'lucide-react'
import arrowIcon from '../../assets/icons/arrow.svg'
import commentIcon from '../../assets/icons/comment.svg'
import complaintReasonIcon from '../../assets/icons/Specify-reason-for-complaint.svg'
import trashIcon from '../../assets/icons/trash.svg'
import {
  formatComplaintReportLabel,
  getParkingMessages,
} from '../../constants/parkingI18n'
import { useSystemLocale } from '../../hooks/useSystemLocale'
import { cn } from '../../lib/cn'
import type { ParkingComplaint } from '../../types/parking'

type ParkingComplaintDetailsPanelProps = {
  complaint: ParkingComplaint
  onBack: () => void
  onClose: () => void
  onDelete?: () => void
}

type ComplaintBadgeCardProps = {
  icon: string
  subtitle?: string | null
  title: string
}

function ComplaintBadgeCard({ icon, subtitle, title }: ComplaintBadgeCardProps) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-[10px] bg-surface px-4 py-3.5 shadow-card">
      <img alt="" aria-hidden="true" className="size-7 shrink-0" src={icon} />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="font-heading text-base leading-5 font-medium text-text-primary">
          {title}
        </div>
        {subtitle ? (
          <div className="font-heading text-base leading-5 font-normal text-text-secondary">
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ComplaintCommentCard({
  comment,
  title,
}: {
  comment: string
  title: string
}) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-surface shadow-card">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <img alt="" aria-hidden="true" className="size-7 shrink-0" src={commentIcon} />
        <div className="font-heading text-base leading-5 font-medium text-text-primary">
          {title}
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="m-0 font-heading text-base leading-6 font-normal tracking-wide text-text-primary">
          {comment}
        </p>
      </div>
    </div>
  )
}

export function ParkingComplaintDetailsPanel({
  complaint,
  onBack,
  onClose,
  onDelete,
}: ParkingComplaintDetailsPanelProps) {
  const locale = useSystemLocale()
  const messages = getParkingMessages(locale)
  const authorName = complaint.authorName?.trim() || messages.anonymousUser
  const comment = complaint.comment?.trim() || messages.noComment
  const reportLabel =
    formatComplaintReportLabel(complaint.reportLabel, locale) || messages.noComplaints

  return (
    <aside className="pointer-events-auto flex h-full w-full max-w-[24.5rem] flex-col overflow-hidden rounded-none border-r border-border bg-surface-muted shadow-[0_16px_40px_rgb(0_0_0_/_0.08)] md:max-w-[24.5rem]">
      <div className="px-6 pt-6">
        <div className="flex h-10 items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <button
              aria-label={messages.close}
              className="flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={onBack}
              type="button"
            >
              <img alt="" aria-hidden="true" className="size-6" src={arrowIcon} />
            </button>
            <h2 className="font-heading text-xl leading-7 font-normal text-text-primary">
              {messages.reviews}
            </h2>
          </div>

          <button
            aria-label={messages.close}
            className="flex size-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="px-4 py-4">
          <h3 className="font-heading text-base leading-5 font-medium text-text-primary">
            {authorName}
          </h3>
        </div>

        <div className="space-y-2">
          <ComplaintBadgeCard
            icon={complaintReasonIcon}
            subtitle={reportLabel}
            title={messages.specifyReasonForComplaint}
          />

          <ComplaintCommentCard comment={comment} title={messages.comment} />
        </div>
      </div>

      <div className="px-6 pb-4">
        <button
          className={cn(
            'flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-surface px-6 font-heading text-base leading-6 font-medium text-text-primary shadow-card transition hover:bg-surface-muted',
          )}
          onClick={onDelete}
          type="button"
        >
          <img alt="" aria-hidden="true" className="size-6 shrink-0" src={trashIcon} />
          <span>{messages.delete}</span>
        </button>
      </div>
    </aside>
  )
}
