// 🐨 here are the things you're going to need for this test:
// import React from 'react'
// import {render, screen, waitFor} from '@testing-library/react'
// import {queryCache} from 'react-query'
// import {buildUser, buildBook} from 'test/generate'
// import * as auth from 'auth-provider'
// import {AppProviders} from 'context'
// import {App} from 'app'

// 🐨 after each test, clear the queryCache and auth.logout

test.todo('renders all the book information')
// 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value (can be anything for now)

// 🐨 create a user using `buildUser`
// 🐨 create a book use `buildBook`
// 🐨 update the URL to `/book/${book.id}`
//   💰 window.history.pushState({}, 'page title', route)
//   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState

// 🐨 reassign window.fetch to another function and handle the following requests:
// - url ends with `/me`: respond with {user}
// - url ends with `/list-items`: respond with {listItems: []}
// - url ends with `/books/${book.id}`: respond with {book}
// 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
// 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})

// 🐨 render the App component and set the wrapper to the AppProviders
// (that way, all the same providers we have in the app will be available in our tests)

// 🐨 use waitFor to wait for the queryCache to stop fetching and the loading
// indicators to go away
// 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitfor
// 💰 if (queryCache.isFetching or there are loading indicators) then throw an error...

// 🐨 assert the book's info is in the document
import React from 'react'
import {
  render,
  screen,
  loginAsUser,
  waitForLoadingToFinish,
  waitFor,
} from 'test/app-test-utils'
import {queryCache} from 'react-query'
import {buildUser, buildBook, buildListItem} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'
import {rest} from 'msw'
import {server} from 'test/server'
import faker from 'faker'
import userEvent from '@testing-library/user-event'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'

async function renderBookScreen({user, book, listItem} = {}) {
  if (user === undefined) {
    user = await loginAsUser()
  }

  if (book === undefined) {
    book = await booksDB.create(buildBook())
  }

  if (listItem === undefined) {
    await listItemsDB.create(buildListItem({owner: user, book}))
  }

  const apiUrl = process.env.REACT_APP_API_URL
  const route = `/book/${book.id}`

  await render(<App />, {route})

  return {book}
}

test('renders all the book information', async () => {
  // window.localStorage.setItem(auth.localStorageKey, 'tokennennenen')
  // window.fetch = async (url, config) => {
  //   const apiUrl = process.env.REACT_APP_API_URL
  //   let data

  //   switch (url) {
  //     case apiUrl + '/bootstrap':
  //       data = {user, ...listItems}
  //       break
  //     case apiUrl + `/books/${book.id}`:
  //       data = {book}
  //       break
  //     default:
  //       break
  //   }

  //   return Promise.resolve({
  //     ok: true,
  //     json: async () => data,
  //   })
  // }

  const {book} = await renderBookScreen({listItem: null})

  expect(screen.getByText(book.title)).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByLabelText('Add to list')).toBeInTheDocument()
  expect(screen.queryByLabelText('Mark as read')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Remove from list')).not.toBeInTheDocument()
  expect(screen.queryByRole('img')).toHaveAttribute(
    'src',
    'http://placeimg.com/640/480',
  )
})

test('can create a list item for the book', async () => {
  const user = await loginAsUser()
  const book = buildBook()
  const listItems = {listItems: []}
  const route = `/book/${book.id}`
  const apiUrl = process.env.REACT_APP_API_URL

  await booksDB.create(book)

  window.history.pushState({}, 'list-items', '/list')
  expect(screen.queryByText(book.title)).not.toBeInTheDocument()
  expect(screen.queryByText(book.author)).not.toBeInTheDocument()

  // window.history.pushState({}, 'book', route)

  await render(<App />, {route})

  expect(screen.getByText(book.title)).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', {name: /add to list/i}))
  await waitForLoadingToFinish()

  expect(screen.queryByLabelText('Add to list')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Mark as read')).toBeInTheDocument()
  expect(screen.queryByLabelText('Remove from list')).toBeInTheDocument()

  window.history.pushState({}, 'list-items', '/list')
  expect(screen.queryByText(book.title)).toBeInTheDocument()
  expect(screen.queryByText(book.author)).toBeInTheDocument()
})

test('can remove a list item for the book', async () => {
  await renderBookScreen()

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  userEvent.click(screen.getByRole('button', {name: /remove from list/i}))
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  await renderBookScreen()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  userEvent.click(screen.queryByRole('button', {name: /mark as read/i}))
  expect(
    screen.queryByRole('button', {name: /mask as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mask as unread/i}),
  ).not.toBeInTheDocument()
})

test('can edit a note', async () => {
  jest.useFakeTimers()
  await renderBookScreen()
  userEvent.clear(screen.getByRole('textbox'))
  userEvent.type(screen.getByRole('textbox'), 'hi guy!')
  await screen.findByLabelText(/loading/i)

  expect(screen.getByRole('textbox')).toHaveValue('hi guy!')
})

describe('console error', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error')
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  test('shows an error message when the book fails to load', async () => {
    jest.useFakeTimers()
    const book = {
      id: faker.random.uuid(),
      title: faker.lorem.words(),
      author: faker.name.findName(),
      coverImageUrl: faker.image.imageUrl(),
      pageCount: faker.random.number(400),
      publisher: faker.company.companyName(),
      synopsis: faker.lorem.paragraph(),
    }
    await renderBookScreen({book, listItem: null})
    expect(screen.getByText(/book not found/i)).toBeInTheDocument()
    expect(console.error).toHaveBeenCalled()
  })

  test('note update failures are displayed', async () => {
    const testErrorMessage = '__test_error_message__'
    const apiURL = process.env.REACT_APP_API_URL
    jest.useFakeTimers()

    server.use(
      rest.put(`${apiURL}/list-items/:listItemId`, async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({status: 400, message: testErrorMessage}),
        )
      }),
    )

    await renderBookScreen()

    userEvent.clear(screen.getByRole('textbox'))
    userEvent.type(screen.getByRole('textbox'), 'hi guy!')
    await screen.findAllByText(testErrorMessage)

    expect(screen.getAllByText(testErrorMessage)[0]).toBeInTheDocument()
  })
})
