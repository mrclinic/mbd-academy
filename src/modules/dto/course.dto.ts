import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty() @IsString() nameEn: string;
  @ApiProperty() @IsString() nameAr: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() descriptionEn?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() descriptionAr?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() categoryId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() trainerId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() levelId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() published?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() price?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() url?: string;
  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() syllabusEn?: string[];
  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() syllabusAr?: string[];
}

export class UpdateCourseDto extends CreateCourseDto { }
