export type ContainerStatus = 'Active' | 'Expired' | 'PendingReview'

export interface Container {
  id: string
  location: string
  type: string
  capacity: number
  lastInspection: string
  notes: string
  assignedTeam: string
  temperature: number | null
  humidity: number | null
  pressure: number | null
  contract: string
  owner: string
  status: ContainerStatus
}

export interface ContainerFilter {
  status?: ContainerStatus | ContainerStatus[]
  contract?: string
  owner?: string
  search?: string
}

export interface ContainerPage {
  items: Container[]
  total: number
}

export interface ContainerPageRequest {
  page: number
  size: number
  sortField?: string
  sortOrder?: 1 | -1 | 0
  filters?: Record<string, string[]>
}
