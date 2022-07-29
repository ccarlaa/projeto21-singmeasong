import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals'

import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import recommendationService from "../../src/services/recommendationsService.js"
import { conflictError } from "../../src/utils/errorUtils.js"

describe('Recommendation service test',() => {
    it("Should create a new recommendation", async() => {
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(() => {
            return null
        });
        const createRecommendation = jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(() => {
            return undefined
        });

        const recommendation = {
            name: faker.music.songName(),
            youtubeLink: faker.internet.url()
        }
        
        await recommendationService.insert(recommendation)
      
        expect(createRecommendation).toHaveBeenCalled()
      })

      it("Should return conflict error", async() => {
        const recommendation = {
            id: 1,
            name: faker.music.songName(),
            youtubeLink: faker.internet.url(),
            score: 0
        }

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(recommendation);
        
      
        expect(recommendationService.insert(recommendation)).rejects.toEqual(conflictError("Recommendations names must be unique"))
      })
  });

