import { InMemoryAnswerCommentsRepository } from 'test/respositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from '../fetch-answers-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to fetch question comments', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
      }),
    )

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated question comments', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(2)
    }
  })
})
