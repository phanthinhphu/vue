export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type AppButtonSize = 'sm' | 'md' | 'lg'

export interface AppButtonProps {
  variant?: AppButtonVariant
  size?: AppButtonSize
  loading?: boolean
  disabled?: boolean
  iconLeft?: string
  iconRight?: string
}
