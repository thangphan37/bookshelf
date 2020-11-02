// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
// import {Dialog} from './lib'

// 💰 Here's a reminder of how your components will be used:
/*
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
*/

// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitely shared state, so...
// 🐨 create a ModalContext here with React.createContext

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function

// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)

// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true

// 🐨 create a ModalContent component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).

// 🐨 don't forget to export all the components here
/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'
import {Dialog, CircleButton} from './lib'
import VisuallyHidden from '@reach/visually-hidden'

const ModalContext = React.createContext()
const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

function Modal({children}) {
  const [isOpen, setOpen] = React.useState(false)
  const value = React.useMemo(() => [isOpen, setOpen], [isOpen])
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

function ModalDismissButton({children}) {
  const [, setOpen] = React.useContext(ModalContext)
  const onClose = () => setOpen(false)

  return React.cloneElement(children, {onClick: onClose})
}

function ModalOpenButton({children}) {
  const [, setOpen] = React.useContext(ModalContext)
  const onOpen = () => setOpen(true)
  return React.cloneElement(children, {
    onClick: callAll(onOpen, children.props.onClick),
  })
}

function ModalContentsBase({children, ...props}) {
  const [isOpen, setOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setOpen(false)} {...props}>
      {children}
    </Dialog>
  )
}

function ModalContents({title, children, ...props}) {
  return (
    <ModalContentsBase {...props}>
      <ModalDismissButton>
        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
      </ModalDismissButton>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
