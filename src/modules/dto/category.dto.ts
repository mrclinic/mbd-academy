import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty() @IsString() nameEn: string;
  @ApiProperty() @IsString() nameAr: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() descriptionEn?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() descriptionAr?: string;
  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() tags?: string[];
}

export class UpdateCategoryDto extends CreateCategoryDto { }
