import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { summarizePrompt } from '../prompts/summarizePrompt.js'
import 'dotenv/config'


export const aiPrompt = async (file) => {
    const mp3file = await ai.files.upload({
        file: file,
        config: { mimeType: "audio/mp3"},
    })

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
            createPartFromUri(mp3file.uri, mp3file.mimeType),
            summarizePrompt,
        ])
    })
    console.log(response.text);
}