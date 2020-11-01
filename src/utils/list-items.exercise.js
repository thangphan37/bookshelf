// 🐨 we're going to use React hooks in here now so we'll need React
import {useQuery, useMutation, queryCache} from 'react-query'
import React from 'react'
// 🐨 get AuthContext from ./context/auth-context
import {setQueryDataForBook} from './books'
import {useAuth, useClient} from 'context/auth-context'

// 💣 remove the user argument here
function useListItems() {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient()

  const {data} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client(`list-items`).then(data => data.listItems),
    onSuccess: async listItems => {
      for (const listItem of listItems) {
        setQueryDataForBook(listItem.book)
      }
    },
  })
  return data ?? []
}

// 💣 remove the user argument here
function useListItem(bookId) {
  // 💣 you no longer need to pass the user here
  const {user} = useAuth()

  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

// 💣 remove the user argument here
function useUpdateListItem(options) {
  const {user} = useAuth()
  const client = useClient()
  // 🐨 get the user from React.useContext(AuthContext)
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

// 💣 remove the user argument here
function useRemoveListItem(options) {
  const {user} = useAuth()
  const client = useClient()
  // 🐨 get the user from React.useContext(AuthContext)
  return useMutation(({id}) => client(`list-items/${id}`, {method: 'DELETE'}), {
    onMutate(removedItem) {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  })
}

// 💣 remove the user argument here
function useCreateListItem(options) {
  const client = useClient()

  // 🐨 get the user from React.useContext(AuthContext)
  return useMutation(({bookId}) => client(`list-items`, {data: {bookId}}), {
    ...defaultMutationOptions,
    ...options,
  })
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
