// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const Locators = require('../fixtures/Locators.json')

Cypress.Commands.add('loginCommandBackend', (userName, password) => {
    cy.request({
        method : 'POST',
        url : 'https://gradebook-api.vivifyideas.com/api/login',
        body : {
            email:"cypress@test.com",
            password:"test1234"
        }
    }).its('body').then((responseBody) => {
        window.localStorage.setItem('loginToken', responseBody.token);
        
    })
})

Cypress.Commands.add('loginCommandFrontend', (userName, password) => {
         cy.get(Locators.Header.Login).click()
         cy.get(Locators.Login.Email).type(userName)
         cy.get(Locators.Login.Password).type(password)
         cy.get(Locators.Login.Submit).click()
})

Cypress.Commands.add('addNewProfessor', (firstName, lastName, imageUrl) => {
    
    cy.get(Locators.Header.Professors).should('be.visible').click()
    cy.get(Locators.Header.CreateProfessor).click()
    cy.get(Locators.CreateProfessor.FirstName).type(firstName)
    cy.get(Locators.CreateProfessor.LastName).type(lastName)
    cy.get(Locators.CreateProfessor.AddImages).click()
    cy.get(Locators.CreateProfessor.OneImageUrl).type(imageUrl)
    cy.get(Locators.CreateProfessor.Submit).click()
})


