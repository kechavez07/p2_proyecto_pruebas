import { Request, Response } from 'express';
import Pin from '../models/Pin';
import path from 'path';
import { Multer } from 'multer';

export const createPin = async (req: Request, res: Response) => {
  try {
    const { title, description, authorName } = req.body;
    // Multer guarda los archivos en req.files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const avatarFile = files?.avatar?.[0];

    if (!imageFile || !avatarFile) {
      return res.status(400).json({ message: 'Imagen y avatar requeridos' });
    }

    // Construir URLs públicas
    const imageUrl = `/uploads/${imageFile.filename}`;
    const authorAvatar = `/uploads/${avatarFile.filename}`;

    const pin = await Pin.create({
      title,
      description,
      imageUrl,
      authorName,
      authorAvatar
    });
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
