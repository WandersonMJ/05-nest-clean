import type { MockInstance } from 'vitest'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryQuestionAttachmentsRepository } from 'test/respositories/in-memory-question-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/respositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { waitFor } from 'test/utils/wait-for'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    // Questions
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    // Answers
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    // Notifications useCase
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // Subscriber
    // eslint-disable-next-line no-new
    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    await inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
