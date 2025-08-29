import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfilesService } from './services/profiles.service';
import { ProfileFactory } from './factories/profile.factory';
import { Profile } from '../entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfileFactory],
  exports: [ProfilesService, ProfileFactory],
})
export class ProfilesModule {}

