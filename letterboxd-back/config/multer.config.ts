/**
 * Configuração do Multer para upload de arquivos
 *
 * Define como os arquivos enviados pelos usuários devem ser armazenados,
 * validados e processados no servidor (imagens de filmes, fotos de perfil, etc)
 *
 * Características:
 * - Armazenamento em disco organizado por pastas
 * - Nomes de arquivo únicos para evitar conflitos
 * - Validação de tipo MIME (apenas imagens)
 * - Limite de tamanho de arquivo (5MB)
 */

import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

// Tipos MIME permitidos para upload (apenas imagens)
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Factory function que retorna a configuração do Multer para uma pasta específica
 *
 * @param folder - Nome da pasta dentro de 'uploads/' onde os arquivos serão salvos
 * @returns Configuração do Multer
 *
 * @example
 * multerConfig('movies')  // Salva em uploads/movies/
 * multerConfig('avatars') // Salva em uploads/avatars/
 */
export const multerConfig = (folder: string) => ({
  storage: diskStorage({
    /**
     * Define o diretório de destino para os arquivos
     * Cria o diretório automaticamente se não existir
     */
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      // Constrói o caminho absoluto: /projeto/uploads/folder
      const uploadPath = resolve(process.cwd(), 'uploads', folder);

      // Cria o diretório recursivamente se não existir
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    /**
     * Gera um nome único para cada arquivo enviado
     *
     * Formato: timestamp-random.ext
     * Exemplo: 1704412345678-987654321.jpg
     */
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      // Cria um sufixo único combinando timestamp e número aleatório
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      // Extrai a extensão do arquivo original (.jpg, .png, etc)
      const fileExt = extname(file.originalname);

      // Retorna o nome final: sufixo único + extensão
      cb(null, `${uniqueSuffix}${fileExt}`);
    },
  }),

  // Limites de tamanho
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo de 5MB por arquivo
  },

  /**
   * Filtro para validar o tipo de arquivo
   * Aceita apenas arquivos de imagem (JPEG, PNG, GIF, WebP)
   */
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    // Verifica se o tipo MIME do arquivo está na lista permitida
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }

    // Arquivo válido, permite o upload
    cb(null, true);
  },
});
