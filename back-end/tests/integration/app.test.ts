import app from "../../src/app.js"
import { prisma } from '../../src/database.js'
import supertest from 'supertest';
import { Recommendation } from "@prisma/client";

import { newRecomendation, randomInt, returnRecomendationWithScore } from "../factory/recommendationsFactory.js"

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    const recomendation = returnRecomendationWithScore(10)
    await prisma.recommendation.create({data: recomendation})
})

describe("/recommendations/ POST", () => {
    it("Return 201 for valid params", async() => {
        const recomendation = newRecomendation();
        const result = await supertest(app).post("/recommendations/").send(recomendation);
        const status = result.status;
        expect(status).toEqual(201);

        const answer = await prisma.recommendation.findFirst({
            where: {name: recomendation.name }
          });
      
        expect(answer.name).toBe(recomendation.name);
    });

    it("Return wrong schema error for invalid params", async() => {
        const recomendation = newRecomendation();
        delete recomendation.youtubeLink

        const result = await supertest(app).post("/recommendations/").send(recomendation);
        const status = result.status;
      
        expect(status).toEqual(422)
    });
})

describe("/recommendations/ GET", () => {
    it("Return 200 for valid params", async() => {
        const result = await supertest(app).get("/recommendations/");
        const status = result.status;

        expect(status).toEqual(200);
        expect(result.body).not.toBeNull()
    });
})

describe("/recommendations/top/:amount GET", () => {
    it("Return 200 for valid params", async() => {
        const recomendation = newRecomendation();
        await supertest(app).post("/recommendations/").send(recomendation);

        const amount = randomInt(0,10)
        const result = await supertest(app).get(`/recommendations/top/${amount}`);
        const status = result.status;

        expect(status).toEqual(200);
        expect(result.body).not.toBeNull()
    });
})

describe("/recommendations/:id GET", () => {
    it("Return 200 for valid params", async() => {
        const result = await supertest(app).get(`/recommendations/1`);
        const status = result.status;

        expect(status).toEqual(200);
        expect(result.body.id).toEqual(1)
    });
})

describe("/recommendations/:id/upvote POST", () => {
    it("Return 200 for valid params", async() => {
        const result = await supertest(app).post(`/recommendations/1/upvote`);
        const status = result.status;

        expect(status).toEqual(200);
    });
})

describe("/recommendations/:id/downvote POST", () => {
    it("Return 200 for valid params", async() => {
        const result = await supertest(app).post(`/recommendations/1/downvote`);
        const status = result.status;

        expect(status).toEqual(200);
    });
})

describe("/recommendations/random GET", () => {
    it("Return 200 for valid params", async() => {
        const result = await supertest(app).get("/recommendations/random");
        const status = result.status;

        expect(status).toEqual(200);
        expect(result.body).not.toBeNull()
    });

    it("Return not found error", async() => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations`
        const result = await supertest(app).get("/recommendations/random");
        const status = result.status;

        expect(status).toEqual(404);
    })
})

afterAll(async () => {
    await prisma.$disconnect();
})
