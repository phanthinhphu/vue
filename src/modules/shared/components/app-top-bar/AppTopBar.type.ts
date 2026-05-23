export interface TopBarTab {
  label: string
  key: string
  active?: boolean
}

export interface AppTopBarUser {
  name: string
  initials: string
  avatarSrc?: string
}

export interface AppTopBarProps {
  appTitle: string
  tabs: TopBarTab[]
  user: AppTopBarUser
}
