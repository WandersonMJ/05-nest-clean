import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachments-repository'
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionComents = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionComents
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionComents = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionComents
  }
}
