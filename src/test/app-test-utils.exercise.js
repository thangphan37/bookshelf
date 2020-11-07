import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {AppProviders} from 'context'
import {buildUser} from 'test/generate'
import * as usersDB from 'test/data/users'
import * as auth from 'auth-provider'

async function customRender(ui, {route, ...options}) {
  window.history.pushState({}, 'test', route)

  render(ui, {wrapper: AppProviders, ...options})

  await waitForLoadingToFinish()
}

async function waitForLoadingToFinish() {
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])
}

async function loginAsUser() {
  const user = buildUser()

  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

export * from '@testing-library/react'

export {customRender as render, loginAsUser, waitForLoadingToFinish}
