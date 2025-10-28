import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreatePricingPlanDto, UpdatePricingPlanDto } from '../dto/pricing.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const createSchema = Joi.object({
  nameEn: Joi.string().required().example('Pro Plan'),
  nameAr: Joi.string().required().example('الخطة المتقدمة'),
  price: Joi.number().required().example(59.99),
  featuresEn: Joi.array().items(Joi.string()).optional().default([]),
  featuresAr: Joi.array().items(Joi.string()).optional().default([]),
});

export const updateSchema = Joi.object({
  nameEn: Joi.string().optional().example('Pro Plan'),
  nameAr: Joi.string().optional().example('الخطة المتقدمة'),
  price: Joi.number().optional().example(59.99),
  featuresEn: Joi.array().items(Joi.string()).optional().default([]),
  featuresAr: Joi.array().items(Joi.string()).optional().default([]),
  active: Joi.boolean().optional().example(true),
});

@ApiTags('Pricing Plans')
@Controller('pricing')
export class PricingController {
  constructor(
    private service: PricingService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // GET /pricing
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all pricing plans' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status', enum: ['true', 'false'] })
  @ApiResponse({
    status: 200,
    description: 'List of pricing plans',
    schema: {
      example: {
        total: 2,
        page: 1,
        perPage: 10,
        data: [
          {
            id: 1,
            nameEn: 'Basic Plan',
            nameAr: 'الخطة الأساسية',
            price: 9.99,
            features: ['Feature 1', 'Feature 2'],
            active: true,
            createdAt: '2025-10-11T10:00:00Z',
          },
        ],
      },
    },
  })
  async findAll(@Req() req: any) {
    return this.service.findAll(req.query || {});
  }


  // ---------------------------
  // GET /pricing/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a single pricing plan by ID' })
  @ApiParam({ name: 'id', description: 'Pricing plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Pricing plan retrieved successfully',
    schema: {
      example: {
        id: 1,
        nameEn: 'Basic Plan',
        nameAr: 'الخطة الأساسية',
        price: 9.99,
        features: ['Feature 1', 'Feature 2'],
        active: true,
        createdAt: '2025-10-11T10:00:00Z',
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  // ---------------------------
  // POST /pricing
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Create a new pricing plan' })
  @ApiResponse({
    status: 201,
    description: 'Pricing plan created successfully',
    schema: {
      example: {
        id: 2,
        nameEn: 'Pro Plan',
        nameAr: 'الخطة المتقدمة',
        price: 19.99,
        features: ['Feature A', 'Feature B'],
        active: true,
        createdAt: '2025-10-11T11:00:00Z',
      },
    },
  })
  @ApiBearerAuth()
  async create(@Body() body: CreatePricingPlanDto) {
    const validated = validateRouteBody(this.reflector, (this as any).create, body);
    return this.service.create(validated);
  }

  // ---------------------------
  // PUT /pricing/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  @JoiSchema(updateSchema)
  @ApiOperation({ summary: 'Update a pricing plan' })
  @ApiParam({ name: 'id', description: 'Pricing plan ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Pricing plan updated successfully',
    schema: {
      example: {
        id: 1,
        nameEn: 'Updated Plan',
        price: 14.99,
        features: ['Feature 1', 'Feature 3'],
        active: true,
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: UpdatePricingPlanDto) {
    const validated = validateRouteBody(this.reflector, (this as any).update, body);
    return this.service.update(Number(id), validated);
  }

  // ---------------------------
  // DELETE /pricing/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pricing plan' })
  @ApiParam({ name: 'id', description: 'Pricing plan ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Pricing plan deleted successfully',
    schema: { example: { message: 'Pricing plan deleted successfully', id: 1 } },
  })
  async remove(@Param('id') id: number) {
    return this.service.remove(Number(id));
  }

  // ---------------------------
  // PATCH /pricing/:id/toggle-active
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle active status of a pricing plan' })
  @ApiParam({ name: 'id', description: 'Pricing plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Pricing plan active status toggled',
    schema: {
      example: {
        id: 1,
        active: false,
        message: 'Pricing plan active status updated successfully',
      },
    },
  })
  @ApiBearerAuth()
  async toggleActive(@Param('id') id: number) {
    return this.service.toggleActive(Number(id));
  }
}