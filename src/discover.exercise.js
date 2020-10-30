/** @jsx jsx */
import {jsx} from '@emotion/core'

import './bootstrap'
import Tooltip from '@reach/tooltip'
import React from 'react'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks'
import * as colors from './styles/colors'
// 🐨 import the client from './utils/api-client'
const actionTypes = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

const initBookReducer = (initialBook) => typeof initialBook === 'function' ? initialBook() : initialBook
function bookReducer(state, action) {
  switch(action.type) {
    case actionTypes.LOADING: {
      return {...state, status: action.type, error: null}
    }
    case actionTypes.SUCCESS: {
      return {...state, status: action.type, data: action.data, error: null}
    }
    case actionTypes.ERROR: {
      console.log(action)
      return {...state, status: action.type, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function DiscoverBooksScreen() {
  // 🐨 add state for status ('idle', 'loading', or 'success'), data, and query
  // const [{status, data, error}, dispatch] = React.useReducer(bookReducer, () => {
  //   return {
  //     status: 'idle', data: []
  //   }
  // }, initBookReducer)
  
  const {data, error, run, isLoading, isError, isSuccess} = useAsync()
  const [query, setQuery] = React.useState('')
  const queried = Boolean(query)
  // const data = null // 💣 remove this, it's just here so the example doesn't explode
  // 🐨 you'll also notice that we don't want to run the search until the
  // user has submitted the form, so you'll need a boolean for that as well
  // 💰 I called it "queried"
  // 🐨 Add a useEffect callback here for making the request with the
  // client and updating the status and data.
  // 💰 Here's the endpoint you'll call: `books?query=${encodeURIComponent(query)}`
  // 🐨 remember, effect callbacks are called on the initial render too
  // so you'll want to check if the user has submitted the form yet and if
  // they haven't then return early (💰 this is what the queried state is for).
  React.useEffect(() => {
    if(queried) {
      run(client(`books?query=${encodeURIComponent(query)}`))
      // dispatch({type: actionTypes.LOADING})
      // client(`books?query=${encodeURIComponent(query)}`)
      // .then(data => dispatch({type: actionTypes.SUCCESS, data}))
      // .catch(error => dispatch({type: actionTypes.ERROR, error}))
    }
  }, [queried, query])

  // 🐨 replace these with derived state values based on the status.
  // const isLoading = false
  // const isSuccess = false
  // const isLoading = status === 'loading'
  // const isSuccess = status === 'success'
  // const isError = status === 'error'

  function handleSearchSubmit(event) {
    // 🐨 call preventDefault on the event so you don't get a full page reload
    // 🐨 set the queried state to true
    // 🐨 set the query value which you can get from event.target.elements
    // 💰 console.log(event.target.elements) if you're not sure.
    event.preventDefault()
    const {search} = event.target.elements
    setQuery(search.value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}
      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
