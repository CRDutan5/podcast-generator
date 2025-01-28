import express from "express";
import { generateTranscript } from "../controllers/transcriptController.js";

const transcriptRouter = express.Router();

transcriptRouter.post("/generate-transcript", generateTranscript);

export default transcriptRouter;
