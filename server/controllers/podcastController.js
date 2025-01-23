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

const transcript =
  "Good morning, everyone. Today, I want to remind you of something incredibly important: your potential is limitless. There will be moments when you doubt yourself, when the challenges feel insurmountable, and when you question if you're capable of achieving your goals. But I urge you—don't let those moments define you. Growth happens when you push past the discomfort, when you embrace failure as a stepping stone, and when you believe in the possibility of a better tomorrow. Remember, every great achievement in history started with someone who decided to try. So, take that first step, even if it feels small. Be bold, stay curious, and never underestimate the power of perseverance. You are capable of extraordinary things, and the world is waiting to see what you'll create. Let's go out there and make it happen. Thank you.";

const prompt = `Below I will attach a transcript to give you some context. Your job will be to create a podcast transcript of two people that is about 3 minutes long. ${transcript}`;

const result = await model.generateContent(prompt);

const generatedTranscript = result.response.text();

console.log(generatedTranscript);
export const generatePodcast = async (req, res) => {
  // const { transcript } = req.body;
};
