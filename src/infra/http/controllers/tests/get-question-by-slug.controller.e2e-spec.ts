import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch recent questions (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent()

        await prisma.question.create({
            data: {
                title: 'question 1',
                content: 'question content',
                slug: 'question-1',
                authorId: user.id.toString(),
            }
        })

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const response = await request(app.getHttpServer())
            .get(`/questions/question-1`)
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({
                title: 'question 1',
            })
        })
    })
})
