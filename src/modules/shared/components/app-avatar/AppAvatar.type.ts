export type AppAvatarSize = 'sm' | 'md' | 'lg'

export interface AppAvatarProps {
  src?: string
  initials: string
  size?: AppAvatarSize
  ariaLabel?: string
}
