/// <reference types="Cypress" />
const faker = require('faker')
const Locators = require('../fixtures/Locators.json')

let gradebookData = {
    randomTitle: faker.name.title(), 
}
let studentData = {
    randomName : faker.name.firstName(),
    randomLastName : faker.name.lastName(),
    randomImage: faker.image.avatar(),
}
let gradebookId = "";
let commentId = 0;
let correctEmail = 'cypress@test.com';
let commentBody = faker.lorem.sentence()

describe('My gradebook', () => {

    beforeEach('login', () => {
        cy.visit('/')
        cy.loginCommandFrontend(correctEmail, "test1234")  
    })

    it('Create gradebook and asign to myself', () =>{
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/diaries', (req) => {

        }).as('succesfulCreateGradebook')
        
        cy.get(Locators.Header.CreateGradebook).should('be.visible').click()
        cy.get(Locators.CreateGradebook.Title).type(gradebookData.randomTitle)
        cy.get(Locators.CreateGradebook.Professor).select("Cypress Cypressic")
        cy.get(Locators.CreateGradebook.Submit).click()
        cy.wait('@succesfulCreateGradebook').then((interception) => {
            expect(interception.response.body.title).to.equal(gradebookData.randomTitle)
            gradebookId = interception.response.body.id;
        })
    })

    it('Get my gradebook', () => {
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/diaries/my-diary/1262', (req) => {

        }).as('succesfulGetMyGradebook')
        cy.get(Locators.Header.MyGradebook).should('be.visible').click()
        cy.wait('@succesfulGetMyGradebook').then((interception) => {
            expect(interception.response.body.title).to.equal(gradebookData.randomTitle)
            expect(interception.response.body.id).to.equal(gradebookId)
            expect(interception.response.body.professor_id).to.equal(1262)
        })
    })

    it('Add Student', () => {
        cy.get(Locators.Header.MyGradebook).should('be.visible').click()
        cy.get(Locators.MyGradebook.DeleteGradebook).should('be.visible')
        cy.get(Locators.MyGradebook.AddStudentSubmitComment).eq(0).click()
        cy.get(Locators.AddStudent.FirstName).should('be.visible').type(studentData.randomName)
        cy.intercept('GET', `https://gradebook-api.vivifyideas.com/api/diaries/${gradebookId}`, (req) => {

        }).as('succesfulGetMyGradebook')
        cy.get(Locators.AddStudent.LastName).type(studentData.randomLastName)
        cy.get(Locators.AddStudent.Submit).click()
        cy.wait('@succesfulGetMyGradebook').then((interception) => {
            //Zbog flow-a koji sam napravio znam da ce mi dodati student biti prvi i jedini na listi, ali ipak zarad vezbe, stavljam for petlju da pretrci listu i pronadje ga
            var arrayStudents = interception.response.body.students;
            var studentExist = false;
            for(var i = 0; i < arrayStudents.length; i++){
                if(arrayStudents[i].firstName === studentData.randomName && arrayStudents[i].lastName === studentData.randomLastName){
                    studentExist = true;                  
                }              
            }       
            expect(studentExist).to.be.true
        })      
    })

    it('Add comment', () => {
        cy.intercept('POST', `https://gradebook-api.vivifyideas.com/api/diaries/${gradebookId}/comments`, (req) => {
        }).as('successfulPostComment')
       
        cy.get(Locators.Header.MyGradebook).should('be.visible').click()
        cy.get(Locators.MyGradebook.CommentField).type(commentBody)
        cy.get(Locators.MyGradebook.AddStudentSubmitComment).eq(1).click()
        
        cy.wait('@successfulPostComment').then((interception) => {
            expect(interception.response.body.text).to.equal(commentBody)
            commentId = interception.response.body.id;   //izvlacimo ID dodatog komentara
        })     
    })

    it('Delete Gradebook', () => {
        cy.intercept('DELETE', `https://gradebook-api.vivifyideas.com/api/diaries/${gradebookId}`, (req) => {

        }).as('succesfulDeleteGradebook')
        cy.get(Locators.Header.MyGradebook).should('be.visible').click()
        cy.get(Locators.MyGradebook.DeleteGradebook).click()
        cy.wait('@succesfulDeleteGradebook').then((interception) => {
            expect(interception.response.body.title).to.equal(gradebookData.randomTitle)
            expect(interception.response.body.id).to.equal(gradebookId)
        })
    })
})