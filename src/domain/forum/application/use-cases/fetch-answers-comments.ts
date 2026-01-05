import { left, right, type Either } from '@/core/either'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import type { AnswerCommentsRepository } from '../repositories/answers-comments-repository'
import type { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComments,
    })
  }
}
