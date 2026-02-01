import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit question (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        questionFactory = moduleRef.get(QuestionFactory)
        studentFactory = moduleRef.get(StudentFactory)
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[Put] /questions/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const questionId = question.id.toString()

        const response = await request(app.getHttpServer())
            .put(`/questions/${questionId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'new title',
                content: 'new content',
            })
        
        console.log('response:::', response.error)


        const QuestionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'new title',
                content: 'new content',
            },
        })
        
        expect(response.statusCode).toBe(204)

        expect(QuestionOnDatabase).toBeTruthy()
    })
})
