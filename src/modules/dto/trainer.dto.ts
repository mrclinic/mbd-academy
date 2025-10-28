import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTrainerDto {
  @ApiProperty() @IsString() nameEn: string;
  @ApiProperty() @IsString() nameAr: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bioEn?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bioAr?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() specialityId?: number;
}

export class UpdateTrainerDto extends CreateTrainerDto { }
