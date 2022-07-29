import app from "../../src/app.js"
import { prisma } from '../../src/database.js'
import supertest from 'supertest';

import { newRecomendation, randomInt } from "../factory/recommendationsFactory.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
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
    it("Return 201 for valid params", async() => {
        const result = await supertest(app).get("/recommendations/");
        const status = result.status;

        expect(status).toEqual(200);
    });
})

describe("/recommendations/top/:amount GET", () => {
    it("Return 201 for valid params", async() => {
        const recomendation = newRecomendation();
        await supertest(app).post("/recommendations/").send(recomendation);

        const amount = randomInt(0,10)
        const result = await supertest(app).get(`/recommendations/top/${amount}`);
        const status = result.status;

        expect(status).toEqual(200);
    });
})

afterAll(async () => {
    await prisma.$disconnect();
})
