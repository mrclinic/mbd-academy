import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateLevelDto, UpdateLevelDto } from '../dto/level.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

const createSchema = Joi.object({
  nameEn: Joi.string().required(),
  nameAr: Joi.string().required(),
  descriptionEn: Joi.string().optional().allow(null, ''),
  descriptionAr: Joi.string().optional().allow(null, ''),
});

const updateSchema = Joi.object({
  nameEn: Joi.string().optional(),
  nameAr: Joi.string().optional(),
  descriptionEn: Joi.string().optional().allow(null, ''),
  descriptionAr: Joi.string().optional().allow(null, ''),
});

@ApiTags('Levels')
@Controller('levels')
export class LevelsController {
  constructor(
    private service: LevelsService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // GET /levels
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all levels' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ar'] })
  @ApiResponse({
    status: 200,
    description: 'List of levels',
    schema: {
      example: {
        total: 2,
        page: 1,
        perPage: 10,
        data: [
          {
            id: 1,
            nameEn: 'Beginner',
            nameAr: 'مبتدئ',
            descriptionEn: 'Suitable for beginners',
            descriptionAr: 'مناسب للمبتدئين',
          },
        ],
      },
    },
  })
  async findAll(@Req() req: any) {
    return this.service.findAll(req.query || {});
  }

  // ---------------------------
  // GET /levels/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a single level by ID' })
  @ApiParam({ name: 'id', description: 'Level ID' })
  @ApiResponse({
    status: 200,
    description: 'Single level retrieved',
    schema: {
      example: {
        id: 1,
        nameEn: 'Beginner',
        nameAr: 'مبتدئ',
        descriptionEn: 'Suitable for beginners',
        descriptionAr: 'مناسب للمبتدئين',
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  // ---------------------------
  // POST /levels
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Create a new level' })
  @ApiResponse({
    status: 201,
    description: 'Level created successfully',
    schema: {
      example: {
        id: 2,
        nameEn: 'Intermediate',
        nameAr: 'متوسط',
        descriptionEn: 'For intermediate learners',
      },
    },
  })
  @ApiBearerAuth()
  async create(@Body() body: CreateLevelDto) {
    const validated = validateRouteBody(this.reflector, (this as any).create, body);
    return this.service.create(validated);
  }

  // ---------------------------
  // PUT /levels/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  @JoiSchema(updateSchema)
  @ApiOperation({ summary: 'Update a level' })
  @ApiParam({ name: 'id', description: 'Level ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Level updated successfully',
    schema: {
      example: {
        id: 1,
        nameEn: 'Beginner Updated',
        descriptionEn: 'Updated description',
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: UpdateLevelDto) {
    const validated = validateRouteBody(this.reflector, (this as any).update, body);
    return this.service.update(Number(id), validated);
  }

  // ---------------------------
  // DELETE /levels/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a level' })
  @ApiParam({ name: 'id', description: 'Level ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Level deleted successfully',
    schema: { example: { message: 'Level deleted successfully', id: 1 } },
  })
  async remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }
}