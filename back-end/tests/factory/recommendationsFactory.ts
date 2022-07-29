import { faker } from '@faker-js/faker';

export function returnRecomendationWithScore(score: number) {
    const recommendation = {
        id: 1,
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=6Zm5yrJCnQk&list=RDMMbg64AFnRnkc&index=3",
        score: score
    }
    return recommendation
}

export function newRecomendation() {
    const recommendation = {
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=6Zm5yrJCnQk&list=RDMMbg64AFnRnkc&index=3"
    }
    return recommendation
}