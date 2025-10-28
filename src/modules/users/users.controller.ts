/* import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
    Patch,
    Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { RegisterUserDto, UpdateUserDto } from '../dto/user.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';

const createSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    displayName: Joi.string().optional(),
    roleId: Joi.number().optional(),
});

const updateSchema = Joi.object({
    displayName: Joi.string().optional(),
    roleId: Joi.number().optional(),
    password: Joi.string().min(6).optional(),
});

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private service: UsersService,
        private reflector: Reflector,
    ) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Post()
    @JoiSchema(createSchema)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiBearerAuth()
    async create(@Body() body: RegisterUserDto) {
        const validated = validateRouteBody(this.reflector, (this as any).create, body);
        return this.service.create(validated);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'perPage', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiResponse({ status: 200, description: 'List of users' })
    @ApiBearerAuth()
    async findAll(@Req() req: any) {
        return this.service.findAll(req.query || {});
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get(':id')
    @ApiOperation({ summary: 'Get a single user by ID' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Patch(':id')
    @JoiSchema(updateSchema)
    @ApiOperation({ summary: 'Update user info' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiBearerAuth()
    async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const validated = validateRouteBody(this.reflector, (this as any).update, body);
        return this.service.update(id, validated);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiBearerAuth()
    async remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
} */