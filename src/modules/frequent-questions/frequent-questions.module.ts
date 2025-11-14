
import { Module } from '@nestjs/common';
import { FrequentQuestionsService } from './frequent-questions.service';
import { FrequentQuestionsController } from './frequent-questions.controller';

@Module({
  providers: [FrequentQuestionsService],
  controllers: [FrequentQuestionsController],
})
export class FrequentQuestionsModule { }
