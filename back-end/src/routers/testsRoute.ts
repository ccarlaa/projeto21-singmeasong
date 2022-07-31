
import { Router } from "express";
import { resetDatabase } from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post("/reset-database", resetDatabase);
// testsRouter.post("/seed-database", seedDatabase)
// testsRouter.post("/seed-lowScoreSong", seedLowScoreSong)

export default testsRouter;