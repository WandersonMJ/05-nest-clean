import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from '../answer-question'
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer a Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      content: 'Resposta da pergunta',
      instructorId: '1',
      questionId: '1',
      attachmentsIds: ['1', '2'],
    })

    expect(result.value?.answer.id).toBeTruthy()

    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('2'),
      }),
    ])
  })
})
