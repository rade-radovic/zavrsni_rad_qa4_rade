/// <reference types="Cypress" />
const faker = require('faker')
const Locators = require('../fixtures/Locators.json')

let professorData = {
    randomName : faker.name.firstName(),
    randomLastName : faker.name.lastName(),
    randomImage: faker.image.avatar(),
    randomName2 : faker.name.firstName(),
    randomLastName2 : faker.name.lastName(),
    randomImage2: faker.image.avatar(),
    randomImage3: faker.image.avatar(),
}


let correctEmail = 'cypress@test.com';

describe('Create Professor', () => {

    beforeEach('Login', () => {
        cy.visit('/')
        cy.loginCommandFrontend(correctEmail, "test1234") 
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
            expect(interception.response.statusCode).to.equal(200)
        })
    })
    //Ocekujem da ce kreirani profesor biti poslednji na listi profesora pa ga tamo trazimo
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

    it('Create new professor with three photos', () => {
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/professors', (req) => {
    
        }).as('successfulCreateProfessor')
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateProfessor.FirstName).type(professorData.randomName2)
        cy.get(Locators.CreateProfessor.LastName).type(professorData.randomLastName2)
        cy.get(Locators.CreateProfessor.AddImages).click()
        cy.get(Locators.CreateProfessor.AddImages).click()
        cy.get(Locators.CreateProfessor.AddImages).click()
        cy.get(Locators.CreateProfessor.OneImageUrl).eq(0).type(professorData.randomImage)   
        cy.get(Locators.CreateProfessor.OneImageUrl).eq(1).type(professorData.randomImage2)
        cy.get(Locators.CreateProfessor.OneImageUrl).eq(2).type(professorData.randomImage3)    //dodajemo 3 slike
        cy.get(Locators.CreateProfessor.ImgButton).eq(4).click()                              //klik na dugme 'move up'
        cy.get(Locators.CreateProfessor.ImgButton).eq(5).click()                               //klik na dugme 'move down'
        cy.get(Locators.CreateProfessor.ImgButton).eq(6).click()                               //Klik na dugme 'remove image' (ostaje nam profesor sa dve slike)
        cy.get(Locators.CreateProfessor.Submit).click()
        cy.wait('@successfulCreateProfessor').then((interception) => {
            expect(interception.response.statusCode).to.equal(200)
        })
    })

    it('Check for new professor on All professors page and number of photos', () => {
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/professors', (req) => {
        //
        }).as('successfulGetAllProfessors')
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.AllProfessors).click()
        cy.wait('@successfulGetAllProfessors').then((interception) => {
            expect(interception.response.body[interception.response.body.length -1].user.firstName).to.equal(professorData.randomName2)
            expect(interception.response.body[interception.response.body.length -1].user.lastName).to.equal(professorData.randomLastName2)
            expect(interception.response.body[interception.response.body.length -1].professor_has_many_images.length).to.equal(2)               

        })
    })
    
})