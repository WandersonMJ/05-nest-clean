import { InMemoryNotificationsRepository } from 'test/respositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      content: '123',
      title: '123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.items[0]).toEqual(
        result.value?.notification,
      )
    }
  })
})
