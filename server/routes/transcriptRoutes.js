import express from "express";
import { generateFromTranscript } from "../controllers/transcriptController.js";

const transcriptRouter = express.Router();

transcriptRouter.post("/generate-from-transcript", generateFromTranscript);

export default transcriptRouter;
