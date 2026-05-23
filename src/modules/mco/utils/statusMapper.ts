import type { ContainerStatus } from '@/domain/entities/container'
import type { AppBadgeVariant } from '@/modules/shared/components/app-badge/AppBadge.type'

export const STATUS_BADGE_VARIANT: Record<ContainerStatus, AppBadgeVariant> = {
  Active:        'success',
  Expired:       'danger',
  PendingReview: 'warning',
}

export const STATUS_LABEL: Record<ContainerStatus, string> = {
  Active:        'Active',
  Expired:       'Expired',
  PendingReview: 'Pending Review',
}
