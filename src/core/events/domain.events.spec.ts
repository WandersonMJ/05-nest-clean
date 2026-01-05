import { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityID } from '../entities/unique-entity-id'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggreateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggreateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // subscriber Cadastrado
    DomainEvents.register(callbackSpy, CustomAggreateCreated.name)

    // criando evento
    const aggregate = CustomAggregate.create()

    // evento criado porém sem disparo
    expect(aggregate.domainEvents).toHaveLength(1)

    // salvando no banco e assim disparando no banco
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // subscriber ouve o evento e faz o que precisa
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
