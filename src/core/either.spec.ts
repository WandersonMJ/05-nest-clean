import { left, right, type Either } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
  return shouldSuccess ? right('success') : left('error')
}

test('success result', () => {
  const success = doSomething(true)

  expect(success.isRight()).toBe(true)
  expect(success.isLeft()).toBe(false)
})

test('error result', () => {
  const error = doSomething(false)

  expect(error.isLeft()).toBe(true)
  expect(error.isRight()).toBe(false)
})
