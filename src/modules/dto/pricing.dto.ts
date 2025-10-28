import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreatePricingPlanDto {
  @ApiProperty({ example: 'Pro Plan' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'الخطة المتقدمة' })
  @IsString()
  nameAr: string;

  @ApiProperty({ required: false, example: 59.99 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['Access to all courses', 'Priority support', 'Certificate of completion'],
  })
  @IsOptional()
  @IsArray()
  featuresEn?: string[] = ['Access to all courses', 'Priority support', 'Certificate of completion'];

  @ApiProperty({
    required: false,
    type: [String],
    example: ['الوصول إلى جميع الدورات', 'دعم أولوية', 'شهادة إتمام'],
  })
  @IsOptional()
  @IsArray()
  featuresAr?: string[] = ['الوصول إلى جميع الدورات', 'دعم أولوية', 'شهادة إتمام'];
}

export class UpdatePricingPlanDto extends CreatePricingPlanDto { }
