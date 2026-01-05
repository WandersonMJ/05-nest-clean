import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async delete(answer: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComents = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questionComents
  }
}
