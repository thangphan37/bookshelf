import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'

function useBook(bookId, user) {
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token}),
  })

  return result
}

function useBookSearch(query, user) {
  const result = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () => {
      return client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books)
    },
    config: {
      onSuccess: books => {
        for (const book of books) {
          setQueryDataForBook(book)
        }
      },
    },
  })

  return result
}

async function refetchBookSearchQuery(query, user) {
  return await queryCache.prefetchQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () => {
      return client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books)
    },
  })
}

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], {book})
}

export {useBook, useBookSearch, refetchBookSearchQuery, setQueryDataForBook}
