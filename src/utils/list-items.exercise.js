import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import {setQueryDataForBook} from 'utils/books'

function useListItem(user, bookId) {
  const result = useListItems(user)
  return result?.find(item => item.bookId === bookId) ?? null
}

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess: listItems => {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })

  return listItems
}

function useUpdateListItem(user, throwOnError) {
  const result = useMutation(
    data =>
      client(`list-items/${data.id}`, {
        token: user.token,
        data,
        method: 'PUT',
      }),
    {
      onMutate: newItem => {
        const prevData = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', oldItems => {
          return oldItems.map(oldItem =>
            oldItem.id === newItem.id ? {...oldItem, ...newItem} : oldItem,
          )
        })

        return () => queryCache.setQueryData('list-items', prevData)
      },
      onSettled: () => queryCache.invalidateQueries('list-items'),
      onError(error, newItem, rollback) {
        rollback()
      },
      ...throwOnError,
    },
  )
  return result
}

function useRemoveListItem(user, throwOnError) {
  const result = useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        token: user.token,
        method: 'DELETE',
      }),
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
      ...throwOnError,
    },
  )
  return result
}

function useCreateListItem(user, throwOnError) {
  const result = useMutation(
    ({bookId}) => client('list-items', {token: user.token, data: {bookId}}),
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
      ...throwOnError,
    },
  )
  return result
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
