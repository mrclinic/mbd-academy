import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty() @IsEmail() email: string;
    @ApiProperty() @IsString() password: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() displayName?: string;
}

export class LoginUserDto {
    @ApiProperty() @IsEmail() email: string;
    @ApiProperty() @IsString() password: string;
}

export class UpdateUserDto {
    @ApiProperty({ required: false }) @IsOptional() @IsString() displayName?: string;
}
