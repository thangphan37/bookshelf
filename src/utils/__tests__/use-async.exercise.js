// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
// import {renderHook, act} from '@testing-library/react-hooks'
// 🐨 Here's the thing you'll be testing:
// import {useAsync} from '../hooks'

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
// function deferred() {
//   let resolve, reject
//   const promise = new Promise((res, rej) => {
//     resolve = res
//     reject = rej
//   })
//   return {promise, resolve, reject}
// }

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

// 🐨 flesh out these tests
test.todo('calling run with a promise which resolves')
// 🐨 get a promise and resolve function from the deferred utility
// 🐨 use renderHook with useAsync to get the result
// 🐨 assert the result.current is the correct default state

// 🐨 call `run`, passing the promise
//    (💰 this updates state so it needs to be done in an `act` callback)
// 🐨 assert that result.current is the correct pending state

// 🐨 call resolve and wait for the promise to be resolved
//    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
// 🐨 assert the resolved state

// 🐨 call `reset` (💰 this will update state, so...)
// 🐨 assert the result.current has actually been reset

test.todo('calling run with a promise which rejects')
// 🐨 this will be very similar to the previous test, except you'll reject the
// promise instead and assert on the error state.
// 💰 to avoid the promise actually failing your test, you can catch
//    the promise returned from `run` with `.catch(() => {})`

test.todo('can specify an initial state')
// 💰 useAsync(customInitialState)

test.todo('can set the data')
// 💰 result.current.setData('whatever you want')

test.todo('can set the error')
// 💰 result.current.setError('whatever you want')

test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error')

import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../hooks'

function getAysncState(overrides) {
  return {
    data: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,

    error: null,
    status: 'idle',
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
    ...overrides,
  }
}

function deferred() {
  let resolve, reject

  const promise = new Promise((res, rej) => {
    ;(resolve = res), (reject = rej)
  })

  return {promise, resolve, reject}
}
test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  const defaultState = getAysncState()

  expect(result.current).toEqual(defaultState)
  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current.status).toBe('pending')

  await act(async () => {
    resolve()
    await p
  })
  expect(result.current.status).toBe('resolved')

  act(() => {
    result.current.reset()
  })
  expect(result.current.status).toBe('idle')
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  const defaultState = getAysncState()

  expect(result.current).toEqual(defaultState)
  let p
  act(() => {
    p = result.current.run(promise).catch(() => {})
  })

  expect(result.current.status).toBe('pending')

  await act(async () => {
    reject()
    await p
  })
  expect(result.current.status).toBe('rejected')

  act(() => {
    result.current.reset()
  })
  expect(result.current.status).toBe('idle')
})

test('can specify an initial state', () => {
  const initalState = {
    data: [],
  }

  const {result} = renderHook(() => useAsync(initalState))
  const state = getAysncState({data: []})

  expect(result.current).toEqual(state)
})

test('can set state data', () => {
  const {result} = renderHook(() => useAsync())
  const state = getAysncState({
    data: [],
    status: 'resolved',
    isSuccess: true,
    isIdle: false,
  })

  act(() => {
    result.current.setData([])
  })
  expect(result.current).toEqual(state)
})

test('can set state error', () => {
  const {result} = renderHook(() => useAsync())

  const state = getAysncState({
    status: 'rejected',
    isError: true,
    isIdle: false,
    error: {message: 'error'},
  })

  act(() => {
    result.current.setError({message: 'error'})
  })
  expect(result.current).toEqual(state)
})

test('No state updates happen if the component is unmounted while pending', () => {
  const {result, unmount} = renderHook(() => useAsync())

  const spy = jest.spyOn(console, 'error')
  unmount()
  expect(spy).toHaveBeenCalledTimes(0)
})

test('calling "run" without a promise results in an early error', async () => {
  const {result, unmount} = renderHook(() => useAsync())

  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
