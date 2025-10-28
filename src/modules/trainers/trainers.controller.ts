import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Query,
} from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateTrainerDto } from '../dto/trainer.dto';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import { Reflector } from '@nestjs/core';
import { validateRouteBody } from '../../validation/validate.helper';

const createSchema = Joi.object({
  nameEn: Joi.string().required(),
  nameAr: Joi.string().required(),
  bioEn: Joi.string().optional().allow(null, ''),
  bioAr: Joi.string().optional().allow(null, ''),
  specialityId: Joi.number().optional().allow(null),
  userId: Joi.string().uuid().optional().allow(null),
});

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(
    private service: TrainersService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // GET /trainers
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all trainers' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'active', required: false, enum: ['true', 'false'], description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'List of trainers' })
  async findAll(@Req() req: any) {
    return this.service.findAll(req.query || {});
  }

  // ---------------------------
  // GET /trainers/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a single trainer by ID' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({
    status: 200,
    description: 'Trainer retrieved successfully',
    schema: { example: { id: 'abc123', nameEn: 'John Doe', active: true } },
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ---------------------------
  // POST /trainers
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'trainer')
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Create a new trainer' })
  @ApiResponse({
    status: 201,
    description: 'Trainer created successfully',
    schema: { example: { id: 'abc123', nameEn: 'John Doe', active: true } },
  })
  @ApiBearerAuth()
  async create(@Body() body: CreateTrainerDto) {
    const validated = validateRouteBody(this.reflector, (this as any).create, body);
    return this.service.create(validated);
  }

  // ---------------------------
  // POST /trainers/:id/photo
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'trainer')
  @Post(':id/photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload or update trainer photo' })
  @ApiResponse({ status: 200, description: 'Trainer photo updated successfully' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) cb(new Error('Only image files are allowed'), false);
      else cb(null, true);
    },
  }))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('No file uploaded');
    const url = `/uploads/${file.filename}`;
    return this.service.updateImage(id, url);
  }

  // ---------------------------
  // DELETE /trainers/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trainer by ID' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Trainer deleted successfully', schema: { example: { message: 'Trainer deleted successfully', id: 'abc123' } } })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ---------------------------
  // PATCH /trainers/:id/toggle-active
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle active status of a trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Trainer active status toggled', schema: { example: { id: 'abc123', active: false, message: 'Trainer active status updated successfully' } } })
  async toggleActive(@Param('id') id: string) {
    return this.service.toggleActive(id);
  }
}