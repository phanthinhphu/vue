export type AppSkeletonVariant = 'text' | 'rect' | 'circle'

export interface AppSkeletonProps {
  variant?: AppSkeletonVariant
  width?: string
  height?: string
  rows?: number
}
