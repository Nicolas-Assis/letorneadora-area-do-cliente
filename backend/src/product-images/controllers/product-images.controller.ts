import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductImagesService } from '../services/product-images.service';
import { UploadProductImageDto } from '../dto/upload-product-image.dto';
import { FilterProductImagesDto } from '../dto/filter-product-images.dto';
import { ProductImageDto } from '../dto/product-image.dto';
import { PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/enums/role.enum';

@ApiTags('product-images')
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de imagem de produto' })
  @ApiBody({
    description: 'Upload de imagem de produto',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPEG, PNG, WebP)',
        },
        productId: {
          type: 'integer',
          description: 'ID do produto',
          example: 1,
        },
        isPrimary: {
          type: 'boolean',
          description: 'Se é a imagem principal',
          example: false,
        },
      },
      required: ['file', 'productId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagem enviada com sucesso',
    type: ProductImageDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou produto não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadProductImageDto,
  ): Promise<ProductImageDto> {
    return this.productImagesService.upload(file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar imagens de produtos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imagens recuperada com sucesso',
    type: PaginatedResponseDto<ProductImageDto>,
  })
  async findAll(@Query() filter: FilterProductImagesDto): Promise<PaginatedResponseDto<ProductImageDto>> {
    return this.productImagesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar imagem por ID' })
  @ApiResponse({
    status: 200,
    description: 'Imagem encontrada',
    type: ProductImageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Imagem não encontrada',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductImageDto> {
    return this.productImagesService.findOneById(id);
  }

  @Patch(':id/set-primary')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Definir imagem como principal' })
  @ApiResponse({
    status: 200,
    description: 'Imagem definida como principal',
    type: ProductImageDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Imagem não encontrada',
  })
  async setPrimary(@Param('id', ParseIntPipe) id: number): Promise<ProductImageDto> {
    return this.productImagesService.setPrimary(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover imagem' })
  @ApiResponse({
    status: 200,
    description: 'Imagem removida com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - role insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Imagem não encontrada',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productImagesService.remove(id);
  }
}

