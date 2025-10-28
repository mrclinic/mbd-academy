import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as Joi from 'joi';
import { Reflector } from '@nestjs/core';
import {
  CreateArticleDto,
  UpdateArticleDto,
  TogglePublishDto,
} from '../dto/article.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import { validateRouteBody } from '../../validation/validate.helper';

// Joi Schemas
const createSchema = Joi.object({
  nameEn: Joi.string().required(),
  nameAr: Joi.string().required(),
  descriptionEn: Joi.string().optional().allow(null, ''),
  descriptionAr: Joi.string().optional().allow(null, ''),
  contentEn: Joi.string().optional().allow(null, ''),
  contentAr: Joi.string().optional().allow(null, ''),
  categoryId: Joi.number().optional().allow(null),
  trainerId: Joi.string().optional().allow(null),
  published: Joi.boolean().optional(),
});

const updateSchema = Joi.object({
  nameEn: Joi.string().optional(),
  nameAr: Joi.string().optional(),
  descriptionEn: Joi.string().optional().allow(null, ''),
  descriptionAr: Joi.string().optional().allow(null, ''),
  contentEn: Joi.string().optional().allow(null, ''),
  contentAr: Joi.string().optional().allow(null, ''),
  categoryId: Joi.number().optional().allow(null),
  trainerId: Joi.string().optional().allow(null),
  published: Joi.boolean().optional(),
});

const publishSchema = Joi.object({
  published: Joi.boolean().required(),
});

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private service: ArticlesService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // GET /articles
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ar'] })
  @ApiResponse({
    status: 200,
    description: 'List of articles',
    schema: {
      example: {
        data: [
          {
            id: 1,
            nameEn: 'How to Train Safely',
            nameAr: 'كيفية التدريب بأمان',
            published: true,
          },
        ],
        pagination: { page: 1, perPage: 10, total: 25 },
      },
    },
  })
  async findAll(@Query() query: any, @Req() req) {
    return this.service.findAll(req.query);
  }

  // ---------------------------
  // GET /articles/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get single article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiResponse({
    status: 200,
    description: 'Single article retrieved',
    schema: {
      example: {
        id: 1,
        nameEn: 'How to Train Safely',
        nameAr: 'كيفية التدريب بأمان',
        descriptionEn: 'Detailed guide to safety training',
        published: true,
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ---------------------------
  // POST /articles
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'trainer')
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Article created successfully',
    schema: {
      example: {
        message: 'Article created successfully',
        data: {
          id: 1,
          nameEn: 'New Training Guide',
          nameAr: 'دليل التدريب الجديد',
          published: false,
        },
      },
    },
  })
  async create(@Body() body: CreateArticleDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).create,
      body,
    );
    return this.service.create(validated);
  }

  // ---------------------------
  // PUT /articles/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'trainer')
  @Put(':id')
  @JoiSchema(updateSchema)
  @ApiOperation({ summary: 'Update an existing article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully',
    schema: {
      example: {
        message: 'Article updated successfully',
        data: {
          id: 1,
          nameEn: 'Updated Title',
          published: true,
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() body: UpdateArticleDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).update,
      body,
    );
    return this.service.update(id, validated);
  }

  // ---------------------------
  // PATCH /articles/:id/publish
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/publish')
  @JoiSchema(publishSchema)
  @ApiOperation({ summary: 'Update publish status of an article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Publish status updated',
    schema: {
      example: {
        message: 'Publish status updated',
        data: { id: 1, published: true },
      },
    },
  })
  async togglePublish(@Param('id') id: string, @Body() body: TogglePublishDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).togglePublish,
      body,
    );
    return this.service.togglePublish(id, validated.published);
  }

  // ---------------------------
  // DELETE /articles/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Article deleted successfully',
    schema: {
      example: { message: 'Article deleted successfully', id: 1 },
    },
  })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}