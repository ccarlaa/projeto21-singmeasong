import { faker } from '@faker-js/faker';

export function returnRecomendationWithScore(score: number) {
    const recommendation = {
        id: 1,
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com//watch?v=6Zm5yrJCnQk&list=RDMMbg64AFnRnkc&index=3",
        score: score
    }
    return recommendation
}

export function newRecomendation() {
    const recommendation = {
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com//watch?v=6Zm5yrJCnQk&list=RDMMbg64AFnRnkc&index=3"
    }
    return recommendation
}

export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}