/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
// 🐨 you're going to need this:
// import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks'
import {FullPageSpinner} from 'components/lib'
import * as colors from './styles/colors'
import * as auth from 'auth-provider'

function App() {
  // 🐨 useState for the user

  // 🐨 create a login function that calls auth.login then sets the user
  // 💰 const login = form => auth.login(form).then(u => setUser(u))
  // 🐨 create a registration function that does the same as login except for register

  // 🐨 create a logout function that calls auth.logout() and sets the user to null

  // 🐨 if there's a user, then render then AuthenitcatedApp with the user and logout
  // 🐨 if there's not a user, then render the UnauthenticatedApp with login and register
  const {
    data,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    setData,
    run,
  } = useAsync()
  const login = form => auth.login(form).then(u => setData(u))
  const register = form => auth.register(form).then(u => setData(u))
  const logout = () => auth.logout().then(() => setData(null))

  React.useEffect(() => {
    async function getUser() {
      const token = await auth.getToken()
      const headers = token ? {Authorization: `Bearer ${token}`} : undefined
      if (token) {
        run(client('me', {headers}))
      } else {
        setData(null)
      }
    }

    getUser()
  }, [run, setData])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return data ? (
    <AuthenticatedApp user={data} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
