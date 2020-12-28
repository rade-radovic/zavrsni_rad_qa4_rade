/// <reference types="Cypress" />
const faker = require('faker')
const Locators = require('../fixtures/Locators.json')

let professorData = {
    randomName : faker.name.firstName(),
    randomLastName : faker.name.lastName(),
    randomImage: faker.image.avatar()
}

let token = "";
let correctEmail = 'cypress@test.com';

describe('Create Professor', () => {

    beforeEach('Login', () => {
        cy.visit('/')
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

    it('Create new professor', () => {
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/professors', (req) => {
    
        }).as('successfulCreateProfessor')
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateProfessor.FirstName).type(professorData.randomName)
        cy.get(Locators.CreateProfessor.LastName).type(professorData.randomLastName)
        cy.get(Locators.CreateProfessor.AddImages).click()
        cy.get(Locators.CreateProfessor.OneImageUrl).type(professorData.randomImage)
        cy.get(Locators.CreateProfessor.Submit).click()
        cy.wait('@successfulCreateProfessor').then((interception) => {
            expect(interception.response.body.message).to.equal("Images Saved!!")
            expect(interception.response.body.success).to.be.true
        })
    })

    it('Check for new professor on All professors page', () => {
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/professors', (req) => {
    
        }).as('successfulGetAllProfessors')
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.AllProfessors).click()
        cy.wait('@successfulGetAllProfessors').then((interception) => {
            expect(interception.response.body[interception.response.body.length -1].user.firstName).to.equal(professorData.randomName)
            expect(interception.response.body[interception.response.body.length -1].user.lastName).to.equal(professorData.randomLastName)
        })
    })

    
})