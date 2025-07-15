import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { createPin, getPins } from '../controllers/pinController';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = 'pins/others';
    if (file.fieldname === 'image') folder = 'pins/images';
    if (file.fieldname === 'avatar') folder = 'pins/avatars';
    return {
      folder,
      resource_type: 'image',
      public_id: Date.now() + '-' + file.originalname
    };
  }
});

// Ruta para crear un Pin, ahora con Cloudinary y solo acepta 'image' y 'avatar'
router.post('/createPin', (req, res) => {
  const upload = multer({ storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al subir archivos', error: err });
    }
    createPin(req, res);
  });
});

//Ruta para obtener todos los pines
router.get('/getPins', getPins);


const upload = multer({ storage });

// Subida de imagen y avatar para los pines
router.post('/pins', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]), createPin);

// Obtener todos los pines
router.get('/pins', getPins);

export default router;
