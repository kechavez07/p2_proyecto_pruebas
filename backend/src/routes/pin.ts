import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { createPin, getPins } from '../controllers/pinController';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Subida de imagen y avatar
router.post('/pins', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]), createPin);

// Obtener todos los pines
router.get('/pins', getPins);

export default router;
