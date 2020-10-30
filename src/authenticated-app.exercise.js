/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
// We'll be doing a lot of stuff with the router on this page.
// 🐨 Here's what you'll need to import from react-router-dom
// Routes, Route, Link
import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {Button} from './components/lib'
import * as mq from './styles/media-queries'
import * as colors from './styles/colors'
import {BookScreen} from '../src/screens/book'
import {DiscoverBooksScreen} from '../src/screens/discover'
import {NotFoundScreen} from '../src/screens/not-found'
// 🐨 you'll need to import all the screen components in the screens directory
// 💰 DiscoverBooksScreen, BookScreen, NotFoundScreen

function AuthenticatedApp({user, logout}) {
  return (
    <React.Fragment>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        {user.username}
        <Button variant="secondary" css={{marginLeft: '10px'}} onClick={logout}>
          Logout
        </Button>
      </div>
      <div
        css={{
          margin: '0 auto',
          padding: '4em 2em',
          maxWidth: '840px',
          width: '100%',
          display: 'grid',
          gridGap: '1em',
          gridTemplateColumns: '1fr 3fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',
          },
        }}
      >
        <div css={{position: 'relative'}}>
          <Nav />
        </div>
        <main css={{width: '100%'}}>
          <AppRoutes user={user} />
        </main>
      </div>
    </React.Fragment>
  )
}

function NavLink(props) {
  // 🐨 change this from an <a /> to a <Link />
  const match = useMatch(props.to)
  return (
    <Link
      css={[
        {
          display: 'block',
          padding: '8px 15px 8px 10px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          color: colors.text,
          borderRadius: '2px',
          borderLeft: '5px solid transparent',
          ':hover': {
            color: colors.indigo,
            textDecoration: 'none',
            background: colors.gray10,
          },
        },
        match
          ? {
              borderLeft: `5px solid ${colors.indigo}`,
              background: colors.gray10,
              ':hover': {
                background: colors.gray20,
              },
            }
          : null,
      ]}
      {...props}
    />
  )
}

function Nav() {
  return (
    <nav
      css={{
        position: 'sticky',
        top: '4px',
        padding: '1em 1.5em',
        border: `1px solid ${colors.gray10}`,
        borderRadius: '3px',
        [mq.small]: {
          position: 'static',
          top: 'auto',
        },
      }}
    >
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
        }}
      >
        <li>
          {/*
              🐨 Once the NavLink has been updated to use a Router Link,
                change from the href prop to a "to" prop
          */}
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

function AppRoutes({user}) {
  // 🐨 Return all the routes here.
  // 💰 Here's the mapping of URL to element:
  //     /discover         <DiscoverBooksScreen user={user} />
  //     /book/:bookId     <BookScreen user={user} />
  //     *                 <NotFoundScreen />
  //
  // Make sure to check the INSTRUCTIONS.md for how this should be structured
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverBooksScreen user={user} />} />
      <Route path="/book/:bookId" element={<BookScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export {AuthenticatedApp}

/*
eslint
  jsx-a11y/anchor-has-content: "off",
*/
