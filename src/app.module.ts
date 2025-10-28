
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContactModule } from './modules/contact/contact.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { LevelsModule } from './modules/levels/levels.module';
import { TrainersModule } from './modules/trainers/trainers.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    CategoriesModule,
    ArticlesModule,
    FeedbackModule,
    EnrollmentsModule,
    TrainersModule,
    LevelsModule,
    PricingModule,
    ContactModule,
  ],
})
export class AppModule { }
