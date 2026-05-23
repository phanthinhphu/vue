export type AppBadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

export interface AppBadgeProps {
  label: string
  variant?: AppBadgeVariant
  dot?: boolean
}
