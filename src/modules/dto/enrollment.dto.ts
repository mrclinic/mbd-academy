import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty() @IsUUID() userId: string;
  @ApiProperty() @IsUUID() courseId: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class UpdateEnrollmentDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}
