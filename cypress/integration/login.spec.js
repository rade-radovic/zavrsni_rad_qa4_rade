/// <reference types="Cypress" />
const Locators = require('../fixtures/Locators.json')

describe ('Login', () => {

    beforeEach('Visit gradebook app', () => {
        cy.visit('/')
        cy.url().should("contains", 'gradebook')
    })
    let correctEmail = 'cypress@test.com';
    it.only('Login with valid credential and check logout', () => {
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
        cy.get(Locators.AllGradebooks.PageTitle).should('be.visible').and('contain.text', ' All Gradebooks Page')
        cy.get(Locators.AllGradebooks.FilterLabel).should('contain.text', 'Gradebook Filter')
        cy.title().should('be.equal', 'gradebook-app')
        cy.get(Locators.Header.Logout).click()
        cy.get(Locators.Header.Login).should('be.visible')
    })

    it('Attempt Login with wrong password', () => {
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login', (req) => {

        }).as('successfulLogin')
        cy.get(Locators.Header.Login).click()
        cy.get(Locators.Login.Email).type(correctEmail)
        cy.get(Locators.Login.Password).type('test1234567')
        cy.get(Locators.Login.Submit).contains('Login').should('be.visible').click()
        cy.wait('@successfulLogin').then((interception) => {
            expect(interception.response.statusCode).to.equal(401)
        })
    })

    it('Attempt login with wrong email', () => {
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login', (req) => {

        }).as('successfulLogin')
        cy.get(Locators.Header.Login).click()
        cy.get(Locators.Login.Email).type('incorectemail123@testtt.com')
        cy.get(Locators.Login.Password).type('test1234')
        cy.get(Locators.Login.Submit).click()
        cy.wait('@successfulLogin').then((interception) => {
            expect(interception.response.statusCode).to.equal(401)
        })
    })
 
})