import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty() @IsUUID() courseId: string;
  @ApiProperty() @IsInt() @Min(1) @Max(5) rating: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() commentEn?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() commentAr?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() userId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() email?: string;
}

export class UpdateFeedbackDto extends CreateFeedbackDto { }
