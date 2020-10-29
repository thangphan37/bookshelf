// 🐨 you'll need to import React and ReactDOM up here

// 🐨 you'll also need to import the Logo component from './components/logo'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')

import React from 'react'
import ReactDOM from 'react-dom'
import {Dialog} from '@reach/dialog'
import {Logo} from './components/logo'
import '@reach/dialog/styles.css'

function LoginForm({onSubmit, buttonText}) {
  const [state, setState] = React.useState({username: '', password: ''})

  function onFormChange(event) {
    setState({...state, [event.target.name]: event.target.value})
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        onSubmit(state)
      }}
    >
      <div>
        <label htmlFor="username">
          Username
          <input id="username" name="username" onChange={onFormChange} />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          Password
          <input id="password" name="password" onChange={onFormChange} />
        </label>
      </div>
      <div>
        <button>{buttonText}</button>
      </div>
    </form>
  )
}

const NONE = 'none'
const LOGIN = 'login'
const REGISTER = 'register'

function App() {
  const [openModal, setOpenModal] = React.useState(NONE)
  
  function handleModal(route = NONE) {
    setOpenModal(route)
  }

  function login(formData) {
    console.log(LOGIN, formData)
  } 

  function register(formData) {
    console.log(REGISTER, formData)
  } 

  return (
    <>
      <Logo width="80" height="80"/>
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => handleModal(LOGIN)}>Login</button>
      </div>
      <div>
        <button onClick={() => handleModal(REGISTER)}>Register</button>
      </div>

      <Dialog isOpen={openModal === LOGIN} onDismiss={handleModal} aria-label="login form">
        <button className="close-button" onClick={handleModal}>
          Close
        </button>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login"/>
      </Dialog>

      <Dialog isOpen={openModal === REGISTER} onDismiss={handleModal} aria-label="register form">
        <button className="close-button" onClick={handleModal}>
          Close
        </button>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register"/>
      </Dialog>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
