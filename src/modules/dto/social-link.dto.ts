import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
    @ApiProperty() @IsString() platformEn: string;
    @ApiProperty() @IsString() platformAr: string;
    @ApiProperty() @IsUrl() url: string;
}

export class UpdateSocialLinkDto extends CreateSocialLinkDto { }
