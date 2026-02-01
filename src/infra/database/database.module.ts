import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionsCommentsRepository } from './prisma/repositories/prisma-questions-comments-repository'
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answers-attachments-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questions-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answers-attachments-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionsCommentsRepository
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionsAttachmentsRepository
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswersCommentsRepository
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
