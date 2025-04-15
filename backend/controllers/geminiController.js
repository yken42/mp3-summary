import express from 'express';
import multer from 'multer';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { summarizePrompt } from '../prompts/summarizePrompt.js'
import 'dotenv/config'
// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const apiKey = process.env.API_KEY
const ai = new GoogleGenAI({ apiKey })

export const sendFileRequest = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        console.log('File details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });

        // Create file object in the format Gemini expects
        const geminiFile = {
            data: file.buffer,
            mimeType: file.mimetype,
            size: file.size,
            slice: (start, end) => file.buffer.slice(start, end)
        };

        console.log('Gemini file object:', {
            hasBuffer: !!geminiFile.data,
            mimeType: geminiFile.mimeType,
            size: geminiFile.size,
            hasSlice: typeof geminiFile.slice === 'function'
        });

        const mp3file = await ai.files.upload({
            file: geminiFile,
            config: { mimeType: file.mimetype }
        });
    
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: createUserContent([
                createPartFromUri(mp3file.uri, mp3file.mimeType),
                summarizePrompt,
            ])
        })
        return res.status(201).json({ 
            message: 'File uploaded successfully',
            fileDetails: {
                name: file.originalname,
                type: file.mimetype,
                size: file.size
            },
            response: response.text
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({ error: error.message });
    }
}