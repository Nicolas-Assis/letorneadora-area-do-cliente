import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseHealthIndicator extends HealthIndicator {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    super();
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Tenta listar buckets para verificar conectividade
      const { data, error } = await this.supabase.storage.listBuckets();
      
      if (error) {
        throw new Error(`Supabase Storage error: ${error.message}`);
      }

      // Verifica se o bucket 'products' existe
      const productsBucket = data?.find(bucket => bucket.name === 'products');
      
      const result = this.getStatus(key, true, {
        bucketsCount: data?.length || 0,
        productsBucketExists: !!productsBucket,
        message: 'Supabase Storage is healthy',
      });

      return result;
    } catch (error) {
      const result = this.getStatus(key, false, {
        message: error.message || 'Supabase Storage check failed',
      });
      
      throw new HealthCheckError('Supabase Storage failed', result);
    }
  }
}

