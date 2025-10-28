import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty() @IsString() nameEn: string;
  @ApiProperty() @IsString() nameAr: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() subjectEn?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() subjectAr?: string;
  @ApiProperty() @IsString() messageEn: string;
  @ApiProperty() @IsString() messageAr: string;
}



export class MarkReadDto {
  @ApiProperty({ example: true, description: 'Mark as read or unread' })
  read: boolean;
}

