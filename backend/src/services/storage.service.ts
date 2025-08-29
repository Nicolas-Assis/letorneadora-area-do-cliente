import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  path: string;
  publicUrl: string;
  fileName: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient;
  private readonly bucket: string;
  private readonly maxSizeMB: number;
  private readonly allowedMimeTypes: string[];

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
    
    this.bucket = this.configService.get<string>('SUPABASE_STORAGE_BUCKET', 'products');
    this.maxSizeMB = this.configService.get<number>('MAX_IMAGE_MB', 5);
    this.allowedMimeTypes = this.configService
      .get<string>('ALLOWED_IMAGE_MIME', 'image/jpeg,image/png,image/webp')
      .split(',');
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'images',
  ): Promise<UploadResult> {
    this.validateFile(file);

    const fileName = this.generateFileName(file.originalname);
    const filePath = `${folder}/${fileName}`;

    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          duplex: 'half',
        });

      if (error) {
        this.logger.error('Erro ao fazer upload:', error);
        throw new BadRequestException(`Erro no upload: ${error.message}`);
      }

      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
        fileName,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error('Erro no upload:', error);
      throw new BadRequestException('Falha no upload da imagem');
    }
  }

  async deleteImage(path: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([path]);

      if (error) {
        this.logger.error('Erro ao deletar arquivo:', error);
        throw new BadRequestException(`Erro ao deletar: ${error.message}`);
      }
    } catch (error) {
      this.logger.error('Erro ao deletar arquivo:', error);
      throw new BadRequestException('Falha ao deletar imagem');
    }
  }

  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    // Validar tamanho
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: ${this.maxSizeMB}MB`,
      );
    }

    // Validar tipo MIME
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Tipos aceitos: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  private generateFileName(originalName: string): string {
    const extension = originalName.split('.').pop();
    const uuid = uuidv4();
    const timestamp = Date.now();
    return `${timestamp}-${uuid}.${extension}`;
  }
}

