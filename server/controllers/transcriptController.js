import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import path from "path";

dotenv.config();

const upload = multer({
  dest: "uploads/",
});

export const generateTranscript = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const audioFilePath = req.file.path;
    const audioFileName = req.file.originalname;
    const audioMimeType = req.file.mimetype;

    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

    const uploadResult = await fileManager.uploadFile(audioFilePath, {
      mimeType: audioMimeType,
      displayName: audioFileName,
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }
    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed");
    }
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Create a small podcast with the topic of the information I gave you",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    fs.unlinkSync(audioFilePath);
    res.status(200).json({ transcript: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate transcript" });
  }
};

export const uploadAudio = upload.single("audio");
