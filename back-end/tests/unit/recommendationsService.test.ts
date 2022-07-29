import { jest } from '@jest/globals';

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import recommendationService from "../../src/services/recommendationsService.js";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";
import { returnRecomendationWithScore } from '../factory/recommendationsFactory.js';

describe('Recommendation service test',() => {
    it("Should create a new recommendation", async() => {
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(null);
        const createRecommendation = jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(null);

        const recommendation = returnRecomendationWithScore(0);
        delete recommendation.id;
        delete recommendation.score;

        await recommendationService.insert(recommendation);
      
        expect(createRecommendation).toHaveBeenCalled();
      });

      it("Should return conflict error for a recommendation already in use", async() => {
        const recommendation = returnRecomendationWithScore(0);

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(recommendation);
      
        expect(recommendationService.insert(recommendation)).rejects.toEqual(conflictError("Recommendations names must be unique"));
      })

      it("Should update vote (+1)", async() => {
        const recommendation = returnRecomendationWithScore(0);

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation);
        const updatedRecommendation = jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => {
            return null
        });

        await recommendationService.upvote(recommendation.id);
      
        expect(updatedRecommendation).toHaveBeenCalled();
      });

      it("Should return error for update vote -> recommendation not found", async() => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(undefined);

        expect(recommendationService.upvote(1)).rejects.toEqual(notFoundError());
      });

      it("Should update vote for score > -5 (-1)", async() => {
        const recommendation = returnRecomendationWithScore(10);

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation);
        const updatedRecommendation = jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation);
        const removeRecommendation = jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

        await recommendationService.downvote(recommendation.id);
      
        expect(updatedRecommendation).toHaveBeenCalled();
        expect(removeRecommendation).not.toHaveBeenCalled();
      });

      it("Should update vote for score < -5 (-1)", async() => {
        const recommendation = returnRecomendationWithScore(-6);

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation);
        const updatedRecommendation = jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation);
        const removeRecommendation = jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

        await recommendationService.downvote(recommendation.id);
      
        expect(updatedRecommendation).toHaveBeenCalled();
        expect(removeRecommendation).toHaveBeenCalled();
      });

      it("Should get random recommendations (> 0.7)", async() => {
        const recommendation = returnRecomendationWithScore(10);

        jest.spyOn(Math, 'random').mockReturnValue(0.8);
        const recommendationList = jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([recommendation]);

        const answer = await recommendationService.getRandom();
      
        expect(recommendationList).toHaveBeenCalled();
        expect(answer).not.toBeNull();
      });

      it("Should get random recommendations (< 0.7)", async() => {
        const recommendation = returnRecomendationWithScore(10);

        jest.spyOn(Math, 'random').mockReturnValue(0.6);
        const recommendationList = jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([recommendation]);

        const answer = await recommendationService.getRandom();
      
        expect(recommendationList).toHaveBeenCalled();
        expect(answer).not.toBeNull();
      });

      it("Return not found error for get random recommendations", async() => {
        const recommendation = returnRecomendationWithScore(10);

        jest.spyOn(Math, 'random').mockReturnValue(0.6);
        const recommendationList = jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);
      
        expect(recommendationList).toHaveBeenCalled();
        expect(recommendationService.getRandom()).rejects.toEqual(notFoundError());
      });

  });
