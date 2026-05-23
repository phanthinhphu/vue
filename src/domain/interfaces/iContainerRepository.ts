import type { Container, ContainerFilter, ContainerPage, ContainerPageRequest } from '../entities/container'

export interface IContainerRepository {
  getAll(filter?: ContainerFilter, signal?: AbortSignal): Promise<Container[]>
  getPage(request: ContainerPageRequest, signal?: AbortSignal): Promise<ContainerPage>
  getChunk(first: number, count: number, signal?: AbortSignal): Promise<Container[]>
}
