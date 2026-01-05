import { left, right, type Either } from '@/core/either'
import type { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  object
>

export class DeleteAnswerUseCase {
  constructor(private AnswerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const Answer = await this.AnswerRepository.findById(answerId)

    if (!Answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== Answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.AnswerRepository.delete(Answer)

    return right({})
  }
}
