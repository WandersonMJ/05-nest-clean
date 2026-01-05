import { left, right, type Either } from '@/core/either'
import type { Answer } from '../../enterprise/entities/answer'
import type { AnswersRepository } from '../repositories/answers-repository'
import type { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface FetchQuestionsAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionsAnswersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answers: Answer[]
  }
>

export class FetchQuestionsAnswersUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionsAnswersUseCaseRequest): Promise<FetchQuestionsAnswersUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return right({
      answers,
    })
  }
}
