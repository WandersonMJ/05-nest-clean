import { Module } from '@nestjs/common'
import { AutenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { PrismaService } from '../database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AutenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
