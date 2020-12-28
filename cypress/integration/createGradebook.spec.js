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

let token = "";
let correctEmail = 'cypress@test.com';
let gradebookId = "";

describe('Create Gradebook', () => {

    beforeEach('login', () => {
        cy.visit('/')
        // cy.request({
        //     method : 'POST',
        //     url : 'https://gradebook-api.vivifyideas.com/api/login',
        //     body : {
        //         email:"cypress@test.com",
        //         password:"test1234"
        //     }
        // }).its('body').then((responseBody) => {
        //     window.localStorage.setItem('token', responseBody.token);
        //     token = responseBody.token;     
        //     console.log(token);
        // })
        
        
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

        //  cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/professors', (req) => {
    
        // }).as('successfulCreateProfessor')
        // cy.get(Locators.Header.Professors).click()
        // cy.get(Locators.Header.CreateProfessor).click()
        // cy.get(Locators.CreateProfessor.FirstName).type(professorData.randomName)
        // cy.get(Locators.CreateProfessor.LastName).type(professorData.randomLastName)
        // cy.get(Locators.CreateProfessor.AddImages).click()
        // cy.get(Locators.CreateProfessor.OneImageUrl).type(professorData.randomImage)
        // cy.get(Locators.CreateProfessor.Submit).click()
        // cy.wait('@successfulCreateProfessor').then((interception) => {
        //     expect(interception.response.body.message).to.equal("Images Saved!!")
        //     expect(interception.response.body.success).to.be.true
        // })
        
    })

    it('Create professor for new gradebook', () => {
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

    it('Create gradebook', () =>{
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/diaries', (req) => {

        }).as('succesfulCreateGradebook')
        cy.get(Locators.Header.CreateGradebook).click()
        cy.get(Locators.CreateGradebook.Title).type(gradebookData.randomTitle)
        cy.get(Locators.CreateGradebook.Professor).select(professorData.randomName + " " + professorData.randomLastName)
        cy.get(Locators.CreateGradebook.Submit).click()
        cy.wait('@succesfulCreateGradebook').then((interception) => {
            expect(interception.response.body.title).to.equal(gradebookData.randomTitle)
            gradebookId = interception.response.body.id;
        })
    })

    it('Check first page for the new gradebook', () => {
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/diaries?page=1', (req) => {

        }).as('getFirstPage')
        cy.get(Locators.Header.CreateGradebook).click()
        cy.get(Locators.Header.AllGradebooks).click()
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
})