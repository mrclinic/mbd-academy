import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  Delete,
  UseGuards, Patch
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { CreateContactMessageDto, MarkReadDto } from '../dto/contact.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().optional().allow(null, ''),
  message: Joi.string().required(),
});

@ApiTags('Contact Messages')
@Controller('contact')
export class ContactController {
  constructor(
    private service: ContactService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // POST /contact
  // ---------------------------
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Send a contact message' })
  @ApiResponse({
    status: 201,
    description: 'Contact message created successfully',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question',
        message: 'Hello!',
        createdAt: '2025-10-11T10:00:00Z',
      },
    },
  })
  async create(@Body() body: CreateContactMessageDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).create,
      body,
    );
    return this.service.create(validated);
  }

  // ---------------------------
  // GET /contact
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of contact messages',
    schema: {
      example: {
        total: 2,
        page: 1,
        perPage: 10,
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Question',
            message: 'Hello!',
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
  // GET /contact/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a single contact message by ID' })
  @ApiParam({ name: 'id', description: 'Contact message ID' })
  @ApiResponse({
    status: 200,
    description: 'Single contact message retrieved',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question',
        message: 'Hello!',
        createdAt: '2025-10-11T10:00:00Z',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // ---------------------------
  // DELETE /contact/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message by ID' })
  @ApiParam({ name: 'id', description: 'Contact message ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact message deleted successfully',
    schema: {
      example: { message: 'Contact message deleted successfully', id: 1 },
    },
  })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  // ---------------------------
  // PATCH /contact/:id/mark-read
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/mark-read')
  @ApiOperation({ summary: 'Mark a contact message as read/unread' })
  @ApiParam({ name: 'id', description: 'Contact message ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact message read status updated',
    schema: {
      example: {
        message: 'Contact message status updated',
        data: {
          id: 1,
          read: true,
        },
      },
    },
  })
  @ApiBearerAuth()
  async markRead(@Param('id') id: string, @Body() body: MarkReadDto) {
    return this.service.markRead(Number(id), body.read);
  }
}