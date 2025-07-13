import { Request, Response } from 'express';
import Pin from '../models/Pin';
import cloudinary from '../config/cloudinary';

export const createPin = async (req: Request, res: Response) => {
  try {
    const { title, description, authorName } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const avatarFile = files?.avatar?.[0];

    if (!imageFile || !avatarFile) {
      return res.status(400).json({ message: 'Imagen y avatar requeridos' });
    }

    // Subir imagen principal a Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'pins/images',
      resource_type: 'image'
    });
    // Subir avatar a Cloudinary
    const avatarUpload = await cloudinary.uploader.upload(avatarFile.path, {
      folder: 'pins/avatars',
      resource_type: 'image'
    });

    const imageUrl = imageUpload.secure_url;
    const authorAvatar = avatarUpload.secure_url;

    const pin = await Pin.create({
      title,
      description,
      imageUrl,
      authorName,
      authorAvatar
    });
    console.log('Pin creado:', pin);
    return res.status(201).json(pin);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el pin', error });
  }
};

export const getPins = async (_req: Request, res: Response) => {
  try {
    const pins = await Pin.findAll();
    res.json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pines', error });
  }
};
