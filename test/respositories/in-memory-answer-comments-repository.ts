import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async delete(answer: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComents = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return answerComents
  }
}
