import { CommentOnAnswerUseCase } from '../comment-on-answer'
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from 'test/respositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on a answer', async () => {
    const newAnswer = makeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: '1',
      content: 'Nova pergunta',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswerCommentsRepository.items[0]?.id).toEqual(
        result.value?.answerComment.id,
      )
    }
  })
})
