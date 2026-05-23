import type { IContainerRepository } from '@/domain/interfaces/iContainerRepository'
import type {
  Container,
  ContainerFilter,
  ContainerPage,
  ContainerPageRequest,
} from '@/domain/entities/container'
import { generateContainers } from '@/modules/mco/mocks/containers.mock'

const MOCK_DATA = generateContainers(10_000)

export class ContainerRepository implements IContainerRepository {
  async getAll(filter?: ContainerFilter, _signal?: AbortSignal): Promise<Container[]> {
    await this.simulateDelay()
    let items = [...MOCK_DATA]

    if (filter?.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status]
      items = items.filter((c) => statuses.includes(c.status))
    }
    if (filter?.contract) {
      items = items.filter((c) => c.contract.toLowerCase().includes(filter.contract!.toLowerCase()))
    }
    if (filter?.owner) {
      items = items.filter((c) => c.owner.toLowerCase().includes(filter.owner!.toLowerCase()))
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase()
      items = items.filter(
        (c) =>
          c.location.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q),
      )
    }

    return items
  }

  async getPage(request: ContainerPageRequest, signal?: AbortSignal): Promise<ContainerPage> {
    const allItems = await this.getAll(undefined, signal)

    let items = [...allItems]

    if (request.filters) {
      for (const [field, values] of Object.entries(request.filters)) {
        if (values.length > 0) {
          items = items.filter((item) => {
            const val = String((item as unknown as Record<string, unknown>)[field] ?? '')
            return values.some((v) => val.toLowerCase().includes(v.toLowerCase()))
          })
        }
      }
    }

    if (request.sortField && request.sortOrder) {
      const field = request.sortField
      const order = request.sortOrder
      items.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[field]
        const bVal = (b as unknown as Record<string, unknown>)[field]
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (aVal < bVal) return -order
        if (aVal > bVal) return order
        return 0
      })
    }

    const total = items.length
    const start = request.page * request.size
    const pageItems = items.slice(start, start + request.size)

    return { items: pageItems, total }
  }

  async getChunk(first: number, count: number, _signal?: AbortSignal): Promise<Container[]> {
    await this.simulateDelay()
    return MOCK_DATA.slice(first, first + count)
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300))
  }
}
