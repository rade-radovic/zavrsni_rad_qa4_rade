/// <reference types="Cypress" />
const Locators = require('../fixtures/Locators.json')

describe ('Login', () => {

    beforeEach('Visit gradebook app', () => {
        cy.visit('/')
        cy.url().should("contains", 'gradebook')
    })
    let correctEmail = 'cypress@test.com';
    it('Login with valid credential', () => {
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login', (req) => {

        }).as('successfulLogin')
        cy.get(Locators.Header.Login).click()
        cy.get(Locators.Login.Email).type(correctEmail)
        cy.get(Locators.Login.Password).type('test1234')
        cy.get(Locators.Login.Submit).click()
        cy.wait('@successfulLogin').then((interception) => {
            // console.log(interception)
            expect(interception.response.body.user.email).to.equal(correctEmail)
        })
    })
 
})