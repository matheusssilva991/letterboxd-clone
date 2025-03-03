import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const multerConfig = (folder: string) => ({
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const uploadPath = resolve(process.cwd(), 'uploads', folder); // Caminho absoluto

      // Criar diretório se não existir
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExt = extname(file.originalname);
      cb(null, `${uniqueSuffix}${fileExt}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB de limite
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
    cb(null, true);
  },
});
