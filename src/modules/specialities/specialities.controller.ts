import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
    Put,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateSpecialityDto, UpdateSpecialityDto } from '../dto/speciality.dto';
import { SpecialitiesService } from './specialities.service';

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

@ApiTags('Specialities')
@Controller('specialities')
export class SpecialitiesController {
    constructor(
        private readonly service: SpecialitiesService,
        private readonly reflector: Reflector,
    ) { }

    @ApiOperation({ summary: 'Get all specialities' })
    @ApiResponse({
        status: 200,
        description: 'List of all specialities',
        schema: {
            example: [
                {
                    id: 1,
                    nameEn: 'Software Development',
                    nameAr: 'تطوير البرمجيات',
                    descriptionEn: 'Building and maintaining software systems.',
                    descriptionAr: 'بناء وصيانة أنظمة البرمجيات.',
                },
            ],
        },
    })
    @Get()
    async findAll(@Query() query: any) {
        return this.service.findAll(query);
    }

    @ApiOperation({ summary: 'Get a speciality by ID' })
    @ApiResponse({
        status: 200,
        description: 'Speciality found',
        schema: {
            example: {
                id: 1,
                nameEn: 'Data Science',
                nameAr: 'علم البيانات',
                descriptionEn: 'Working with big data and AI models.',
                descriptionAr: 'العمل مع البيانات الضخمة ونماذج الذكاء الاصطناعي.',
            },
        },
    })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new speciality (Admin only)' })
    @ApiResponse({
        status: 201,
        description: 'Speciality successfully created',
        schema: {
            example: {
                id: 2,
                nameEn: 'Cybersecurity',
                nameAr: 'الأمن السيبراني',
                descriptionEn: 'Protecting digital systems from cyber threats.',
                descriptionAr: 'حماية الأنظمة الرقمية من التهديدات السيبرانية.',
            },
        },
    })
    @Post()
    @JoiSchema(createSchema)
    async create(@Body() body: CreateSpecialityDto, @Req() req: any) {
        const validated = validateRouteBody(this.reflector, (this as any).create, body);
        return this.service.create(validated);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update a speciality (Admin only)' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Speciality updated successfully',
        schema: {
            example: {
                id: 1,
                nameEn: 'Updated Speciality',
                nameAr: 'تخصص محدث',
                descriptionEn: 'Updated English description',
                descriptionAr: 'وصف محدث باللغة العربية',
            },
        },
    })
    @Put(':id')
    @JoiSchema(updateSchema)
    async update(@Param('id') id: string, @Body() body: UpdateSpecialityDto) {
        const validated = validateRouteBody(this.reflector, (this as any).update, body);
        return this.service.update(Number(id), validated);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a speciality (Admin only)' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Speciality deleted successfully',
        schema: { example: { message: 'Speciality deleted successfully', id: 1 } },
    })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}
