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
import { FrequentQuestionsService } from './frequent-questions.service';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {
    CreateFrequentQuestionDto,
    UpdateFrequentQuestionDto,
} from '../dto/frequent-question.dto';
import {
    ApiTags,
    ApiOperation,
    ApiQuery,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';

const createSchema = Joi.object({
    titleEn: Joi.string().required(),
    titleAr: Joi.string().required(),
    answerEn: Joi.string().required(),
    answerAr: Joi.string().required(),
});

const updateSchema = Joi.object({
    titleEn: Joi.string().optional(),
    titleAr: Joi.string().optional(),
    answerEn: Joi.string().optional(),
    answerAr: Joi.string().optional(),
});

@ApiTags('Frequent Questions')
@Controller('frequent-questions')
export class FrequentQuestionsController {
    constructor(
        private service: FrequentQuestionsService,
        private reflector: Reflector,
    ) { }

    // GET /frequent-questions
    @Get()
    @ApiOperation({ summary: 'Get all frequent questions' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'perPage', required: false })
    @ApiQuery({ name: 'search', required: false })
    async findAll(@Req() req: any) {
        return this.service.findAll(req.query || {});
    }

    // GET /frequent-questions/:id
    @Get(':id')
    @ApiOperation({ summary: 'Get a single frequent question by ID' })
    @ApiParam({ name: 'id', description: 'Frequent Question ID' })
    async findOne(@Param('id') id: number) {
        return this.service.findOne(Number(id));
    }

    // POST /frequent-questions
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Post()
    @JoiSchema(createSchema)
    @ApiOperation({ summary: 'Create a new frequent question' })
    @ApiBearerAuth()
    async create(@Body() body: CreateFrequentQuestionDto) {
        const validated = validateRouteBody(this.reflector, (this as any).create, body);
        return this.service.create(validated);
    }

    // PUT /frequent-questions/:id
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Put(':id')
    @JoiSchema(updateSchema)
    @ApiOperation({ summary: 'Update a frequent question' })
    @ApiBearerAuth()
    async update(@Param('id') id: number, @Body() body: UpdateFrequentQuestionDto) {
        const validated = validateRouteBody(this.reflector, (this as any).update, body);
        return this.service.update(Number(id), validated);
    }

    // DELETE /frequent-questions/:id
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a frequent question' })
    @ApiBearerAuth()
    async remove(@Param('id') id: number) {
        return this.service.remove(Number(id));
    }
}
