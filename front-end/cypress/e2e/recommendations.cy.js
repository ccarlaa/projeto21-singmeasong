/// <reference types="cypress" />

import { faker } from "@faker-js/faker"

beforeEach(() => {
    cy.clearDatabase()
  })

describe("recommendations test suite", () => {

    it("should add a recommendation", () => {
        const recommendation = {
            name: "test new recomendation",
            youtubeLink: "https://www.youtube.com/watch?v=87gWaABqGYs&list=RD87gWaABqGYs&start_radio=1"
        };

        cy.visit("http://localhost:3000/");
        cy.get("#recommendation-name").type(recommendation.name);
        cy.get("#recommendation-link").type(recommendation.youtubeLink);
        cy.intercept("POST", "/recommendations").as("newRecommendation");
        cy.get("#submit-new-recommendation").click();
        cy.wait("@newRecommendation");
    })

    it("should return 409 for a duplicated recommendation", () => {
        const recommendation = {
            name: "test new recomendation",
            youtubeLink: "https://www.youtube.com/watch?v=87gWaABqGYs&list=RD87gWaABqGYs&start_radio=1"
        };

        cy.addRecommendation(recommendation);

        cy.visit("http://localhost:3000/");
        cy.get("#recommendation-name").type(recommendation.name);
        cy.get("#recommendation-link").type(recommendation.youtubeLink);
        cy.intercept("POST", "/recommendations").as("newRecommendation");
        cy.get("#submit-new-recommendation").click();

        cy.wait("@newRecommendation").then(({ response }) => {
            cy.log(response);
            expect(response.statusCode).to.equal(409);
        })
    })

    it("should return 422 for a new recommendation without name", () => {
        const recommendation = {
            name: "",
            youtubeLink: "https://www.youtube.com/watch?v=87gWaABqGYs&list=RD87gWaABqGYs&start_radio=1"
        }

        cy.visit("http://localhost:3000/");
        cy.get("#recommendation-link").type(recommendation.youtubeLink);
        cy.intercept("POST", "/recommendations").as("newRecommendation");
        cy.get("#submit-new-recommendation").click();

        cy.wait("@newRecommendation").then(({ response }) => {
            cy.log(response);
            expect(response.statusCode).to.equal(422)
        })

    })

    it("should return 422 for a new recommendation without link", () => {
        const recommendation = {
            name: "test new recomendation",
            youtubeLink: ""
        }

        cy.visit("http://localhost:3000/");
        cy.get("#recommendation-name").type(recommendation.name);
        cy.intercept("POST", "/recommendations").as("newRecommendation");
        cy.get("#submit-new-recommendation").click();

        cy.wait("@newRecommendation").then(({ response }) => {
            cy.log(response);
            expect(response.statusCode).to.equal(422)
        })

    })
})

