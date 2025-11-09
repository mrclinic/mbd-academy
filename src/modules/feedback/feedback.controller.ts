import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../dto/feedback.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

const createSchema = Joi.object({
  courseId: Joi.string().uuid().required(),
  rating: Joi.number().min(1).max(5).required(),
  commentEn: Joi.string().optional().allow(null, ''),
  commentAr: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  userId: Joi.string().uuid().optional().allow(null),
});

const updateSchema = Joi.object({
  courseId: Joi.string().uuid().required(),
  rating: Joi.number().min(1).max(5).required(),
  commentEn: Joi.string().optional().allow(null, ''),
  commentAr: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  userId: Joi.string().uuid().optional().allow(null),
});

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(
    private service: FeedbackService,
    private reflector: Reflector,
  ) { }

  // ---------------------------
  // POST /feedback
  // ---------------------------
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @JoiSchema(createSchema)
  @ApiOperation({ summary: 'Create feedback for a course' })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        courseId: 'course-uuid',
        rating: 5,
        comment: 'Great course!',
        email: 'user@example.com',
        userId: 'user-uuid',
        createdAt: '2025-10-11T10:00:00Z',
      },
    },
  })
  async create(@Body() body: CreateFeedbackDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).create,
      body,
    );
    return this.service.create(validated);
  }

  // ---------------------------
  // GET /feedback/course/:courseId
  // ---------------------------
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get all feedback for a specific course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of feedbacks for the course',
    schema: {
      example: {
        total: 2,
        page: 1,
        perPage: 10,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            rating: 5,
            comment: 'Great course!',
            email: 'user@example.com',
            userId: 'user-uuid',
            createdAt: '2025-10-11T10:00:00Z',
          },
        ],
      },
    },
  })
  async findByCourse(@Param('courseId') courseId: string, @Query() query: any) {
    return this.service.findByCourse(courseId, query);
  }

  // ---------------------------
  // GET /feedback/:id
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a single feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiResponse({
    status: 200,
    description: 'Feedback retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        courseId: 'course-uuid',
        rating: 5,
        comment: 'Great course!',
        email: 'user@example.com',
        userId: 'user-uuid',
        createdAt: '2025-10-11T10:00:00Z',
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // ---------------------------
  // PATCH /feedback/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  @Patch(':id')
  @JoiSchema(updateSchema)
  @ApiOperation({ summary: 'Update feedback' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Feedback updated successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        rating: 4,
        comment: 'Updated comment',
      },
    },
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateFeedbackDto) {
    const validated = validateRouteBody(
      this.reflector,
      (this as any).update,
      body,
    );
    return this.service.update(id, validated);
  }

  // ---------------------------
  // DELETE /feedback/:id
  // ---------------------------
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Feedback deleted successfully',
    schema: { example: { message: 'Feedback deleted successfully', id: '123e4567-e89b-12d3-a456-426614174000' } },
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ---------------------------
  // GET /feedback/user/:userId
  // ---------------------------
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all feedback submitted by a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of feedback submitted by the user',
    schema: {
      example: {
        total: 3,
        page: 1,
        perPage: 10,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            courseId: 'course-uuid-1',
            rating: 5,
            comment: 'Excellent course!',
            email: 'user@example.com',
            createdAt: '2025-10-11T10:00:00Z',
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174000',
            courseId: 'course-uuid-2',
            rating: 4,
            comment: 'Very informative',
            email: 'user@example.com',
            createdAt: '2025-10-11T11:00:00Z',
          },
        ],
      },
    },
  })
  async findByUser(@Param('userId') userId: string, @Query() query: any) {
    return this.service.findByUser(userId, query);
  }
}