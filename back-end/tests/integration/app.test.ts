import app from "../../src/app.js"
import { prisma } from '../../src/database.js'
import supertest from 'supertest';

import { newRecomendation } from "../factory/recommendationsFactory.js"
import { wrongSchemaError } from "../../src/utils/errorUtils.js"

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
})

describe("Recommendation tests suite", () => {
    it("return 201 for valid params", async() => {
        const recomendation = newRecomendation();
        const result = await supertest(app).post("/recommendations/").send(recomendation);
        const status = result.status;
        expect(status).toEqual(201);

        const answer = await prisma.recommendation.findFirst({
            where: {name: recomendation.name }
          });
      
        expect(answer.name).toBe(recomendation.name);
    });

    it("return wrong schema error for invalid params", async() => {
        const recomendation = newRecomendation();
        delete recomendation.youtubeLink

        const result = await supertest(app).post("/recommendations/").send(recomendation);
        const status = result.status;
      
        expect(status).toEqual(422)
    });
})