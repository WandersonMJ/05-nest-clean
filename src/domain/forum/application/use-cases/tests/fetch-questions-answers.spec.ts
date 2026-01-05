import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository'
import { FetchQuestionsAnswersUseCase } from '../fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/respositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionsAnswersUseCase

describe('Fetch Questions Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionsAnswersUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to fetch question answers', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
      }),
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated recent questions', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(2)
    }
  })
})
