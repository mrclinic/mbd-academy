import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { Reflector } from '@nestjs/core';
import { validateRouteBody } from '../../validation/validate.helper';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Validation Schemas
const createSchema = Joi.object({
  nameEn: Joi.string().required(),
  nameAr: Joi.string().required(),
  descriptionEn: Joi.string().optional().allow(null, ''),
  descriptionAr: Joi.string().optional().allow(null, ''),
  tags: Joi.array().items(Joi.string()).optional(),
});

const updateSchema = Joi.object({
  nameEn: Joi.string().optional(),
  nameAr: Joi.string().optional(),
  descriptionEn: Joi.string().optional().allow(null, ''),
  descriptionAr: Joi.string().optional().allow(null, ''),
  tags: Joi.array().items(Joi.string()).optional(),
});

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private service: CategoriesService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // GET /categories
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ar'] })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    schema: {
      example: {
        total: 2,
        page: 1,
        perPage: 10,
        data: [
          {
            id: 1,
            nameEn: 'Fitness',
            nameAr: 'اللياقة البدنية',
            descriptionEn: 'Health and exercise-related content',
            descriptionAr: 'محتوى متعلق بالصحة والرياضة',
          },
        ],
      },
    },
  })
  async findAll(@Query() query: any, @Req() req) {
    return this.service.findAll(req.query);
  }

  // ---------------------------
  // GET /categories/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Single category retrieved',
    schema: {
      example: {
        id: 1,
        nameEn: 'Fitness',
        nameAr: 'اللياقة البدنية',
        descriptionEn: 'All about fitness and training',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // ---------------------------
  // POST /categories
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      example: {
        id: 3,
        nameEn: 'Nutrition',
        nameAr: 'التغذية',
        descriptionEn: 'All about healthy eating',
      },
    },
  })
  @ApiBearerAuth()
  async create(@Body() body: CreateCategoryDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).create,
      body,
    );
    return this.service.create(validated);
  }

  // ---------------------------
  // PUT /categories/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  @JoiSchema(updateSchema)
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: {
      example: {
        id: 2,
        nameEn: 'Updated Category',
        nameAr: 'فئة محدثة',
        descriptionEn: 'Updated description',
      },
    },
  })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).update,
      body,
    );
    return this.service.update(Number(id), validated);
  }

  // ---------------------------
  // DELETE /categories/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: {
      example: { message: 'Category deleted successfully', id: 1 },
    },
  })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}