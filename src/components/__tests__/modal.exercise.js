// 🐨 you're gonna need this stuff:
// import {Modal, ModalContents, ModalOpenButton} from '../modal'

test.todo('can be opened and closed')
// 🐨 render the Modal, ModalOpenButton, and ModalContents
// 🐨 click the open button
// 🐨 verify the modal contains the modal contents, title, and label
// 🐨 click the close button
// 🐨 verify the modal is no longer rendered
// 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
// 🐨 you're gonna need this stuff:
// import {Modal, ModalContents, ModalOpenButton} from '../modal'

test.todo('can be opened and closed')
// 🐨 render the Modal, ModalOpenButton, and ModalContents
// 🐨 click the open button
// 🐨 verify the modal contains the modal contents, title, and label
// 🐨 click the close button
// 🐨 verify the modal is no longer rendered
// 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)

import {
  Modal,
  ModalContents,
  ModalOpenButton,
  ModalDismissButton,
} from '../modal'
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('can be opened and closed', () => {
  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label="label" title="title">
        <div>content</div>
      </ModalContents>
      <ModalDismissButton>
        <button>Close</button>
      </ModalDismissButton>
    </Modal>,
  )

  userEvent.click(screen.getByRole('button', {name: /open/i}))
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'label')
  expect(screen.getByText(/content/i)).toBeInTheDocument()
  userEvent.click(screen.getByRole('button', {name: /close/i}))
  expect(screen.queryByText(/content/i)).not.toBeInTheDocument()
})
