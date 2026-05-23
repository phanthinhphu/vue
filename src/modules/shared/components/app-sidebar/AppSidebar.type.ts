export interface SidebarItem {
  icon: string
  label: string
  routeName: string
  active?: boolean
}

export interface AppSidebarProps {
  items: SidebarItem[]
  logoSrc: string
  bottomLogoSrc?: string
}
