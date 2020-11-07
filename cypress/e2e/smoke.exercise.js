// 🐨 you'll want a fake user to register as:
// import {buildUser} from '../support/generate'
import {buildUser} from '../support/generate'
describe('smoke', () => {
  it('should allow a typical user flow', () => {
    cy.visit('/')
    cy.findByRole('button', {name: /register/i}).click()
    cy.findByRole('dialog').within(() => {
      const {username, password} = buildUser()
      cy.get('#username').type(username)
      cy.get('#password').type(password)
      cy.findByRole('button', {name: /register/i}).click()
    })

    cy.get('nav').within(() => {
      cy.get('li')
        .contains('Discover')
        .should('have.attr', 'href', '/discover')
        .click()
    })

    cy.get('main').within(() => {
      cy.get('#search').type('How to Be an Antiracist').type('{enter}')
      cy.findByRole('listitem').within(() => {
        cy.findByRole('button', {name: /add to list/i})
          .should('exist')
          .click()
      })
      cy.findByRole('button', {name: /mark as read/i}).should('exist')
    })

    cy.get('nav').within(() => {
      cy.get('li')
        .contains('Reading List')
        .should('have.attr', 'href', '/list')
        .click()
    })

    cy.get('main').should('have.length', 1)
    cy.get('main').within(() => {
      cy.get('li').contains('How to Be an Antiracist').click()
      cy.get('textarea').type('Notes')
      cy.get('svg[aria-label="loading"]').should('exist')
      cy.get('svg[aria-label="loading"]').should('exist')
      cy.findByRole('button', {name: /mark as read/i})
        .should('exist')
        .click()
      cy.get('input[value="5"]').click({force: true})
    })

    cy.get('nav').within(() => {
      cy.get('li')
        .contains('Finished Books')
        .should('have.attr', 'href', '/finished')
        .click()
    })

    cy.get('main').should('have.length', 1)

    cy.get('main').within(() => {
      cy.get('input[value="5"]').should('have.attr', 'checked', 'checked')
      cy.get('li').contains('How to Be an Antiracist').click()
    })

    cy.get('main').within(() => {
      cy.findByRole('button', {name: /remove from list/i})
        .should('exist')
        .click()
    })

    cy.get('nav').within(() => {
      cy.get('li')
        .contains('Finished Books')
        .should('have.attr', 'href', '/finished')
        .click()
    })

    cy.get('main').within(() => {
      cy.get('ul').should('have.length', 0)
    })

    // 🐨 create a fake user
    // 🐨 visit '/' (📜 https://docs.cypress.io/api/commands/visit.html)
    // 🐨 find the button named "register" and click it
    // 🐨 within the "dialog" find the username and password fields,
    //    type into them the values for your fake user, then click the register
    //    button to submit the form
    // 📜 https://docs.cypress.io/api/commands/within.html#Syntax
    // 📜 https://docs.cypress.io/api/commands/type.html#Syntax
    //
    // 🐨 within the "navigation", find the link named "discover" and click it
    //
    // 🐨 within the "main", type in the "searchbox" the title of a book and hit enter
    //   💰 when using "type" you can make it hit the enter key with "{enter}"
    //   🐨 within the listitem with the name of your book, find the button
    //      named "add to list" and click it.
    //
    // 🐨 click the reading list link in the navigation
    //
    // 🐨 ensure the "main" only has one element "listitem"
    //   💰 https://docs.cypress.io/api/commands/should.html (.should('have.length', 1))
    //   🐨 click the link with the name of the book you added to the list to go to the book's page
    //
    // 🐨 type in the notes textbox
    // The textbox is debounced, so the loading spinner won't show up immediately
    // so to make sure this is working, we need to wait for the spinner to show up
    // and *then* wait for it to go away.
    // 🐨 wait for the loading spinner to show up (💰 .should('exist'))
    // 🐨 wait for the loading spinner to go away (💰 .should('not.exist'))
    //
    // 🐨 mark the book as read
    //
    // the radio buttons are fancy and the inputs themselves are visually hidden
    // in favor of nice looking stars, so we have to the force option to click.
    // 📜 https://docs.cypress.io/api/commands/click.html#Arguments
    // 🐨 click the 5 star rating radio button
    //
    // 🐨 navigate to the finished books page
    //
    // 🐨 make sure there's only one listitem here (within "main")
    // 🐨 make sure the 5 star rating radio button is checked
    // 🐨 click the link for your book to go to the books page again
    //
    // 🐨 remove the book from the list
    // 🐨 ensure the notes textbox and the rating radio buttons are gone
    //
    // 🐨 navigate back to the finished books page
    //
    // 🐨 ensure there are no books in the list
  })
})
