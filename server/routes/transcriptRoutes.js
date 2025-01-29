import express from "express";
import {
  generateTranscript,
  uploadAudio,
} from "../controllers/transcriptController.js";

const transcriptRouter = express.Router();

transcriptRouter.post("/generate-transcript", uploadAudio, generateTranscript);

export default transcriptRouter;
