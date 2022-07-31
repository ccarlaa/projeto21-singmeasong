/// <reference types="cypress" />

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
    });

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
        });
    });

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
            expect(response.statusCode).to.equal(422);
        });
    });

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
            expect(response.statusCode).to.equal(422);
        });
    });
});

describe("home page test suite", () => {

    it("should return recommendations", () => {
        cy.visit("http://localhost:3000/");
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.wait("@getRecommendations").then(({ response }) => {
            cy.log(response);
            expect(response.body).not.equal(null)
        });
    })

    it("should vote up", () => {
        const recommendation = {
            name: "test new recomendation",
            youtubeLink: "https://www.youtube.com/watch?v=87gWaABqGYs&list=RD87gWaABqGYs&start_radio=1"
        };

        cy.addRecommendation(recommendation);

        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.visit("http://localhost:3000/");
        cy.wait("@getRecommendations");

        cy.intercept("POST", '/recommendations/1/upvote').as("post-upvote");
        cy.get("#upvote").click();
        cy.wait("@post-upvote").then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
    })

    it("should vote down", () => {
        const recommendation = {
            name: "test new recomendation",
            youtubeLink: "https://www.youtube.com/watch?v=87gWaABqGYs&list=RD87gWaABqGYs&start_radio=1"
        };

        cy.addRecommendation(recommendation);

        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.visit("http://localhost:3000/");
        cy.wait("@getRecommendations");

        cy.intercept("POST", '/recommendations/1/downvote').as("post-downvote");
        cy.get("#downvote").click();
        cy.wait("@post-downvote").then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
    })

    it("should remote recommendantion with votes less than -5", () => {
        const recommendation = {
            name: "test new recomendation",
            youtubeLink: "https://www.youtube.com/watch?v=87gWaABqGYs&list=RD87gWaABqGYs&start_radio=1"
        };

        cy.addRecommendation(recommendation);

        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.visit("http://localhost:3000/");
        cy.wait("@getRecommendations");

        cy.intercept("POST", '/recommendations/1/downvote').as("post-downvote");
        for(let i = 0; i < 6; i++){
            cy.get("#downvote").click();
        }
        cy.wait("@post-downvote").then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
        cy.get("#downvote").should("not.exist");
    })
});
