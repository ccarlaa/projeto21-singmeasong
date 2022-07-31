import { resetDatabase } from "../repositories/testsRepository.js"

export async function resetDatabaseService() {
    await resetDatabase()
}