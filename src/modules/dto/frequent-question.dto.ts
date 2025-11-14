import { ApiProperty } from '@nestjs/swagger';

export class CreateFrequentQuestionDto {
    @ApiProperty()
    titleEn: string;

    @ApiProperty()
    titleAr: string;

    @ApiProperty()
    answerEn: string;

    @ApiProperty()
    answerAr: string;
}

export class UpdateFrequentQuestionDto {
    @ApiProperty({ required: false })
    titleEn?: string;

    @ApiProperty({ required: false })
    titleAr?: string;

    @ApiProperty({ required: false })
    answerEn?: string;

    @ApiProperty({ required: false })
    answerAr?: string;
}
