import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  abstract delete(answer: Answer): Promise<void>
  abstract save(question: Answer): Promise<void>
}
