import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';
import { Roles } from '../auth/roles.decorator';

import { RolesGuard } from '../auth/roles.guard';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'trainer')
  @ApiOperation({ summary: 'Create a course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiBearerAuth()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ar'] })
  @ApiResponse({ status: 200, description: 'List of courses' })
  findAll(@Query() query: PaginationQueryDto, @Req() req) {
    return this.coursesService.findAll(req.query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'ar'] })
  @ApiOperation({ summary: 'Get a single course by ID' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'trainer')
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOperation({ summary: 'Update a course' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'trainer')
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiOperation({ summary: 'Delete a course' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
