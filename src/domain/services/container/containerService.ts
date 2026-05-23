import type { IContainerRepository } from '@/domain/interfaces/iContainerRepository'
import type { Container, ContainerFilter, ContainerPage, ContainerPageRequest } from '@/domain/entities/container'

export class ContainerService {
  constructor(private readonly repository: IContainerRepository) {}

  getAll(filter?: ContainerFilter, signal?: AbortSignal): Promise<Container[]> {
    return this.repository.getAll(filter, signal)
  }

  getPage(request: ContainerPageRequest, signal?: AbortSignal): Promise<ContainerPage> {
    return this.repository.getPage(request, signal)
  }

  getChunk(first: number, count: number, signal?: AbortSignal): Promise<Container[]> {
    return this.repository.getChunk(first, count, signal)
  }
}
