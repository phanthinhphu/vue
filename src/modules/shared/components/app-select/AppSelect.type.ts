export interface SelectableItem {
  label: string
  value: unknown
}

export interface AppSelectProps {
  modelValue: unknown
  options: SelectableItem[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  loading?: boolean
}
