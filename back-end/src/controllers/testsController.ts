import { Request, Response } from "express"
import { resetDatabaseService } from "../services/testsService.js"


export async function resetDatabase(req: Request, res: Response) {
  await resetDatabaseService()

  res.sendStatus(200)
}
