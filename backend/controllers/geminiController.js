import multer from 'multer';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { summarizePrompt } from '../prompts/summarizePrompt.js'
import 'dotenv/config'

// Configure multer for memory storage with file filter
const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        // Comprehensive list of allowed audio MIME types
        const allowedTypes = [
            // MP3 formats
            'audio/mpeg',
            'audio/mp3',
            'audio/x-mpeg',
            'audio/x-mp3',
            
            // WAV formats
            'audio/wav',
            'audio/x-wav',
            'audio/wave',
            'audio/vnd.wave',
            
            // M4A/AAC formats
            'audio/mp4',
            'audio/x-m4a',
            'audio/aac',
            'audio/x-aac',
            
            // OGG formats - expanded
            'audio/ogg',
            'audio/x-ogg',
            'application/ogg',
            'audio/vorbis',
            'audio/opus',
            'audio/x-vorbis+ogg',
            'audio/x-opus+ogg',
            
            // FLAC formats
            'audio/flac',
            'audio/x-flac',
            
            // AIFF formats
            'audio/aiff',
            'audio/x-aiff',
            
            // WMA formats
            'audio/x-ms-wma',
            'audio/wma',
            
            // WebM formats
            'audio/webm',
            'audio/x-webm',
            
            // Other common formats
            'audio/midi',
            'audio/x-midi',
            'audio/amr',
            'audio/amr-wb',
            'audio/basic',
            'audio/x-basic'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            // Try to determine the file type from extension if MIME type check fails
            const fileExt = file.originalname.split('.').pop().toLowerCase();
            const allowedExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac', 'aiff', 'wma', 'webm', 'mid', 'midi', 'amr', 'au'];
            
            if (allowedExtensions.includes(fileExt)) {
                // If extension is allowed, accept the file
                cb(null, true);
            } else {
                cb(new Error(`Invalid file type. Supported formats: ${allowedExtensions.join(', ')}`));
            }
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

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
            size: file.size,
            extension: file.originalname.split('.').pop().toLowerCase()
        });

        // For OGG files, ensure we're using a compatible MIME type
        let mimeType = file.mimetype;
        if (file.originalname.toLowerCase().endsWith('.ogg')) {
            mimeType = 'audio/ogg';
            console.log('OGG file detected, setting MIME type to audio/ogg');
        }

        // Create file object in the format Gemini expects
        const geminiFile = {
            data: file.buffer,
            mimeType: mimeType,
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
            config: { mimeType: mimeType }
        });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: createUserContent([
                createPartFromUri(mp3file.uri, mp3file.mimeType),
                summarizePrompt,
            ])
        });

        return res.status(201).json({ 
            message: 'File uploaded successfully',
            fileDetails: {
                name: file.originalname,
                type: mimeType,
                size: file.size
            },
            response: response.text
        });
    } catch (error) {
        console.error('Error processing file:', error);
        if (error.message.includes('Invalid file type')) {
            return res.status(400).json({ 
                error: error.message,
                supportedFormats: [
                    'MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC', 
                    'AIFF', 'WMA', 'WebM', 'MIDI', 'AMR', 'AU'
                ]
            });
        }
        return res.status(500).json({ error: error.message });
    }
}