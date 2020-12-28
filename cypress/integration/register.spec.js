/// <reference types="Cypress" />
const faker = require('faker')
const Locators = require('../fixtures/Locators.json')

let userData = {
    randomName : faker.name.firstName(),
    randomLastName : faker.name.lastName(),
    randomEmail : faker.internet.email(),
    randomPassword : faker.internet.password(),
}

describe('Register', () => {

    beforeEach('Visit gradebook app', () => {
        cy.visit('/')
        cy.url().should("contains", 'gradebook')
    })

    it('Register with valid data', () =>{
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/register', 
        (req) =>{
        }).as('succesfullyRegistered')
        cy.get(Locators.Header.Register).click()
        cy.get(Locators.Register.FirstName).type(userData.randomName)
        cy.get(Locators.Register.LastName).type(userData.randomLastName)
        cy.get(Locators.Register.Email).type(userData.randomEmail)
        cy.get(Locators.Register.Password).type(userData.randomPassword)
        cy.get(Locators.Register.PasswordConfirmation).type(userData.randomPassword)
        cy.get(Locators.Register.Terms).check()
        cy.get(Locators.Register.Submit).click()
        cy.wait('@succesfullyRegistered').then((interception) => {
            expect(interception.response.body.firstName).to.equal(userData.randomName)
            expect(interception.response.body.lastName).to.equal(userData.randomLastName)
            expect(interception.response.body.email).to.equal(userData.randomEmail)
        })
    
    })

    
})

