import { RepositoryFactory } from '@/infrastructure/repositories/repositoryFactory'
import { PostsRepository } from '@/infrastructure/repositories/posts/postsRepository'
import { PostsService } from '@/domain/services/posts/postsService'
import { MsalService } from '@/domain/services/msal/msalService'
import { ERepositories } from '@/infrastructure/constants'
import type { MsalRepository } from '@/infrastructure/repositories/msal/msalRepository'
import { LocalStorageService } from '@/domain/services/storages/localStorageService'
import type { LocalStorageRepository } from '@/infrastructure/repositories/storages/localStorageRepository'
import { ContainerService } from '@/domain/services/container/containerService'
import type { ContainerRepository } from '@/infrastructure/repositories/container/containerRepository'

const msalRepository = RepositoryFactory.getRepository(ERepositories.Msal) as MsalRepository
const postsRepository = RepositoryFactory.getRepository(ERepositories.Posts) as PostsRepository
const localStorageRepository = RepositoryFactory.getRepository(ERepositories.LocalStorage) as LocalStorageRepository
const containerRepository = RepositoryFactory.getRepository(ERepositories.Container) as ContainerRepository

const postsService = new PostsService(postsRepository)
const msalService = new MsalService(msalRepository)
const localStorageService = new LocalStorageService(localStorageRepository)
const containerService = new ContainerService(containerRepository)

export { postsService, msalService, localStorageService, containerService }
