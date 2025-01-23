import express from "express";
import { generatePodcast } from "../controllers/podcastController.js";

const podcastRouter = express.Router();

podcastRouter.post("/generate-podcast", generatePodcast);

export default podcastRouter;
