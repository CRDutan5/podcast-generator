// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 5500,
  },
});

export const generatePodcast = async (req, res) => {
  try {
    const { transcript } = req.body;
    // const prompt = `Below I will attach a transcript to give you some context. Your job will be to create a podcast transcript of two people that is about 3 minutes long. ${transcript}`;
    const prompt = `Create a small joke with the given transcript: ${transcript}`;

    const result = await model.generateContent(prompt);
    const generatedTranscript = result.response.text();
    return res.status(200).json({ transcript: generatedTranscript });
  } catch (error) {
    console.error("Could not generate podcast", error);
  }
};
