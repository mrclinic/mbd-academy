import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'How to Train Safely' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'كيفية التدريب بأمان' })
  @IsString()
  nameAr: string;

  @ApiProperty({ example: 'A short intro to safe training', required: false })
  @IsOptional() @IsString()
  descriptionEn?: string;

  @ApiProperty({ example: 'مقدمة قصيرة عن التدريب الآمن', required: false })
  @IsOptional() @IsString()
  descriptionAr?: string;

  @ApiProperty({ example: '<p>Full HTML content...</p>', required: false })
  @IsOptional() @IsString()
  contentEn?: string;

  @ApiProperty({ example: '<p>المحتوى الكامل...</p>', required: false })
  @IsOptional() @IsString()
  contentAr?: string;

  @ApiProperty({ example: 3, required: false })
  @IsOptional() @IsUUID()
  categoryId?: number;

  @ApiProperty({ example: 'trainer-123', required: false })
  @IsOptional() @IsUUID()
  trainerId?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional() @IsBoolean()
  published?: boolean;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) { }

export class TogglePublishDto {
  @ApiProperty({ example: true })
  published: boolean;
}
