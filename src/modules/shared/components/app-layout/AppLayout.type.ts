import type { SidebarItem } from '../app-sidebar/AppSidebar.type'
import type { TopBarTab, AppTopBarUser } from '../app-top-bar/AppTopBar.type'

export interface AppLayoutProps {
  sidebarItems: SidebarItem[]
  topBarTabs: TopBarTab[]
  appTitle: string
  user: AppTopBarUser
  logoSrc: string
}
