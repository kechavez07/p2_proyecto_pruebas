import SavedPin from '../models/SavedPin';
// Guardar un pin como favorito
export const savePin = async (req: Request, res: Response) => {
  try {
    const { userId, pinId } = req.body;
    if (!userId || !pinId) {
      return res.status(400).json({ message: 'userId y pinId son requeridos' });
    }
    // Evitar duplicados
    const exists = await SavedPin.findOne({ where: { userId, pinId } });
    if (exists) {
      return res.status(200).json({ message: 'Ya está guardado' });
    }
    await SavedPin.create({ userId, pinId });
    return res.status(201).json({ message: 'Pin guardado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al guardar el pin', error });
  }
};

// Consultar pines guardados por usuario
export const getSavedPinsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'userId es requerido' });
    }
    const saved = await SavedPin.findAll({ where: { userId } });
    const pinIds = saved.map((s: any) => s.pinId);
    const pins = await Pin.findAll({ where: { id: pinIds } });
    return res.status(200).json(pins);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener pines guardados', error });
  }
};
export const getPinsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { authorName } = req.params;
    if (!authorName) {
      res.status(400).json({ message: 'authorName es requerido' });
      return;
    }
    const pins = await Pin.findAll({ where: { authorName } });
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pines del usuario', error });
  }
}
import { Request, Response } from 'express';
import Pin from '../models/Pin';
import cloudinary from '../config/cloudinary';

export const createPin = async (req: Request, res: Response) => {
  try {
    const { title, description, authorName } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const avatarFile = files?.avatar?.[0];

    if (!imageFile || !avatarFile || !title || !description || !authorName) {
      return res.status(400).json({ message: 'Todos los campos son requeridos: imagen, avatar, título, descripción y nombre de autor.' });
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

export const getPins = async (req: Request, res: Response): Promise<void> => {
  try {
    const pins = await Pin.findAll();
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pines', error });
  }
};