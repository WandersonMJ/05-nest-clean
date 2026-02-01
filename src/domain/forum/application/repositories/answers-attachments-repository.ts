import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(AnswerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(AnswerId: string): Promise<void>
}
