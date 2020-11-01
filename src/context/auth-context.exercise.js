// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext
import React from 'react'
import {useAsync} from 'utils/hooks'
import {client} from 'utils/api-client'
import * as auth from 'auth-provider'

export function useClient() {
  const {user} = useAuth()
  const {token} = user

  return (endpoint, config) => client(endpoint, {...config, token})
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth should be used within AuthProvider')
  }
  return context
}

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

export function AuthProvider({children}) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }
  const props = {
    user,
    login,
    register,
    logout,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
  }

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>
}
export const AuthContext = React.createContext()
