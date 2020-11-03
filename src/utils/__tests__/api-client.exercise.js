// 🐨 you'll need the test server
// 💰 the way that our tests are set up, you'll find this in `src/test/server/test-server.js`
// import {server, rest} from 'test/server'
// 🐨 grab the client
// import {client} from '../api-client'
import {server, rest} from 'test/server'
import {client} from '../api-client'
import * as auth from 'auth-provider'
import {queryCache} from 'react-query'

// 🐨 add a beforeAll to start the server with `server.listen()`
// 🐨 add an afterAll to stop the server when `server.close()`
// 🐨 afterEach test, reset the server handlers to their original handlers
// via `server.resetHandlers()`

// 🐨 flesh these out:

const apiURL = process.env.REACT_APP_API_URL
test.todo('calls fetch at the endpoint with the arguments for GET requests')
// 🐨 add a server handler to handle a test request you'll be making
// 💰 because this is the first one, I'll give you the code for how to do that.
// const endpoint = 'test-endpoint'
// const mockResult = {mockValue: 'VALUE'}
// server.use(
//   rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
//     return res(ctx.json(mockResult))
//   }),
// )
//
// 🐨 call the client (don't forget that it's asynchronous)
// 🐨 assert that the resolved value from the client call is correct
test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const response = await client('test-endpoint')
  expect(response).toEqual(mockResult)
})

test.todo('adds auth token when a token is in localStorage')
// 🐨 set the localStorage value to anything you want
// 🐨 create a "request" variable with let
// 🐨 create a server handler to handle a test request you'll be making
// 🐨 inside the server handler, assign "request" to "req" so we can use that
//     to assert things later.
//     💰 so, something like...
//       async (req, res, ctx) => {
//         request = req
//         ... etc...
//
// 🐨 call the client (it's async)
// 🐨 verify that `request.headers.get('Authorization')` is correct (it should include the token)
test('adds auth token when a token is in localStorage', async () => {
  window.localStorage.setItem('test', 'test')
  const endpoint = 'auth'
  let request

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({success: true}))
    }),
  )

  const response = await client('auth', {
    token: window.localStorage.getItem('test'),
  })
  expect(request.headers.get('Authorization')).toEqual(
    'Bearer ' + window.localStorage.getItem('test'),
  )
})

test.todo('allows for config overrides')
// 🐨 do a very similar setup to the previous test
// 🐨 create a custom config that specifies properties like "mode" of "cors" and a custom header
// 🐨 call the client with the endpoint and the custom config
// 🐨 verify the request had the correct properties
test('allow for config overrides', async () => {
  let request
  const endpoint = 'config'
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({success: true}))
    }),
  )
  await client(endpoint, {
    mode: 'mode',
    headers: {'Content-type': 'application/json'},
  })
  expect(request.headers.get('Content-type')).toEqual('application/json')
})

test.todo(
  'when data is provided, it is stringified and the method defaults to POST',
)
test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'post'
  const mockData = {items: []}
  let request
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req

      return res(ctx.json({success: true}))
    }),
  )

  await client(endpoint, {data: mockData})
  expect(request.body).toEqual(mockData)
})
// 🐨 create a mock data object
// 🐨 create a server handler very similar to the previous ones to handle the post request
//    💰 Use rest.post instead of rest.get like we've been doing so far
// 🐨 call client with an endpoint and an object with the data
//    💰 client(endpoint, {data})
// 🐨 verify the request.body is equal to the mock data object you passed

test('when response status in the range 200-299', async () => {
  const endpoint = 'status'

  server.use(
    rest.get(`${apiURL}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({message: 'this is the response!'}))
    }),
  )

  const response = await client(endpoint)
  expect(response).toEqual({message: 'this is the response!'})
})

jest.mock('react-query')
jest.mock('auth-provider')

test('when response status is 401 unauthorized', async () => {
  const endpoint = 'unauthorized'

  server.use(
    rest.get(`${apiURL}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(401), ctx.json({message: 'this is the response!'}))
    }),
  )

  const error = await client(endpoint).catch(e => e)

  expect(auth.logout).toHaveBeenCalled()
  expect(queryCache.clear).toHaveBeenCalled()
})
