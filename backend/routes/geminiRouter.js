import express from 'express';
import { sendFileRequest } from '../controllers/geminiController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// router.get('/ai-response', );
router.post('/upload-file', upload.single('file'), sendFileRequest);

export default router;