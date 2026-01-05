import { ChooseQuestionBestAnswerUseCase } from '../choose-question-best-answer'
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/respositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose a best answer', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
      questionId: newQuestion.id,
    })

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.question.bestAnswerId).toEqual(newAnswer.id)
    }
  })

  it('should not be able to choose another user question best answer', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
      questionId: newQuestion.id,
    })

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
