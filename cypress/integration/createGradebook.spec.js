/// <reference types="Cypress" />
const faker = require('faker')
const Locators = require('../fixtures/Locators.json')

let gradebookData = {
    randomTitle: faker.name.title(), 
}

let professorData = {
    randomName : faker.name.firstName(),
    randomLastName : faker.name.lastName(),
    randomImage: faker.image.avatar()
}


let correctEmail = 'cypress@test.com';
let gradebookId = "";

describe('Create Gradebook', () => {

    beforeEach('login', () => {
        cy.visit('/')
        cy.loginCommandFrontend(correctEmail, "test1234")  
    })

    it('Create professor for new gradebook', () => {

        cy.addNewProfessor(professorData.randomName, professorData.randomLastName, professorData.randomImage)
    })

    it('Create gradebook', () =>{
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/diaries', (req) => {

        }).as('succesfulCreateGradebook')
        
        cy.get(Locators.Header.CreateGradebook).should('be.visible').click()
        cy.get(Locators.CreateGradebook.Title).type(gradebookData.randomTitle)
        cy.get(Locators.CreateGradebook.Professor).select(professorData.randomName + " " + professorData.randomLastName)
        cy.get(Locators.CreateGradebook.Submit).click()
        cy.wait('@succesfulCreateGradebook').then((interception) => {
            expect(interception.response.body.title).to.equal(gradebookData.randomTitle)
            gradebookId = interception.response.body.id;   //izvlacimo ID napravljenog gradebook-a
        })
    })

    it('Check first page for the new gradebook', () => {
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/diaries?page=1', (req) => {

        }).as('getFirstPage')
        cy.get(Locators.Header.CreateGradebook).click()
        cy.get(Locators.Header.AllGradebooks).click()
        //pretrazujemo da li se nas gradebook nalazi na prvoj stranici tako sto ga trazimo putem njegovog ID-ja
        cy.wait('@getFirstPage').then((interception) => {
            var gradebookExist = false;
            for(var i = 0; i < interception.response.body.data.length; i++){
                if(interception.response.body.data[i].id === gradebookId){
                    gradebookExist = true;
                }
            }
            expect(gradebookExist).to.be.true;
        })
    })

    it('Filter for new gradebook and asert we have the right garebook', () => {
        cy.intercept('GET', `https://gradebook-api.vivifyideas.com/api/diaries/${gradebookId}`, (req) => {

        }).as('successfulGetGradebook')
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/diaries?page=1', (req) => {

        }).as('firstPageLoaded')
        cy.wait('@firstPageLoaded')
        cy.get(Locators.Header.AllGradebooks).should('be.visible').click()
        cy.get(Locators.AllGradebooks.FilterField).should('be.visible').type(gradebookData.randomTitle)
        cy.get(Locators.AllGradebooks.Search).click()
        cy.get(`a[href='/single-gradebook/${gradebookId}']`).should('be.visible').click()
        cy.wait('@successfulGetGradebook').then((interception) => {
            expect(interception.response.body.id).to.equal(gradebookId)
            expect(interception.response.body.title).to.equal(gradebookData.randomTitle)
        })
    })

    
})