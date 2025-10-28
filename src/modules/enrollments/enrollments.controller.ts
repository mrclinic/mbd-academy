import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JoiSchema } from '../../validation/joi-schema.decorator';
import * as Joi from 'joi';
import { validateRouteBody } from '../../validation/validate.helper';
import { Reflector } from '@nestjs/core';
import { CreateEnrollmentDto } from '../dto/enrollment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

const enrollSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required(),
  status: Joi.string().optional(),
});

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private service: EnrollmentsService,
    private reflector: Reflector,
  ) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  @Post()
  @JoiSchema(enrollSchema)
  @ApiOperation({ summary: 'Enroll a user in a course' })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
  async enroll(@Body() body: CreateEnrollmentDto) {
    const validated = validateRouteBody(this.reflector, (this as any).enroll, body);
    return this.service.enroll(validated);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/:userId')
  @ApiOperation({ summary: 'Get all enrollments for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiResponse({ status: 200, description: 'List of user enrollments' })
  async myEnrollments(@Param('userId') userId: string, @Query() query: any) {
    return this.service.findByUser(userId, query);
  }
}