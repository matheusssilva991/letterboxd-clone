import { Injectable } from '@nestjs/common';
import { unlink, access } from 'fs/promises';
import { constants } from 'fs';

@Injectable()
export class FileService {
  async deleteImage(imagePath: string): Promise<void> {
    try {
      // Verifica se o arquivo existe
      await access(imagePath, constants.F_OK);

      // Se o arquivo existir, tenta deletá-lo
      await unlink(imagePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return Promise.resolve();
      } else {
        // Outros erros (por exemplo, permissão negada)
        throw error;
      }
    }
  }
}
