import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateSpecialityDto {
    @ApiProperty() @IsString() nameEn: string;
    @ApiProperty() @IsString() nameAr: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() descriptionEn?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() descriptionAr?: string;
}

export class UpdateSpecialityDto extends CreateSpecialityDto { }
