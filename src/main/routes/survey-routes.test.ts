import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });
    afterAll(async () => {
        MongoHelper.disconnect();
    });
    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        surveyCollection.deleteMany({});
        accountCollection = await MongoHelper.getCollection('accounts');
        accountCollection.deleteMany({});
    });
    describe('POST /surveys', () => {
        test('Should return 403 on add survey without accessToken', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'Question',
                    answers: [
                        {
                            answer: 'Answer 1',
                            image: 'http://image-name.com',
                        },
                        {
                            answer: 'Answer 2',
                        },
                    ],
                })
                .expect(403);
        });

        test('Should return 204 on add survey with valid accessToken', async () => {
            const res = await accountCollection.insertOne({
                name: 'Jean',
                email: 'jeanfg86@gmail.com',
                password: '123',
                role: 'admin',
            });

            const id = res.insertedId;
            const _token = sign({ id }, env.jwtSecret);

            await accountCollection.updateOne(
                { _id: id },
                { $set: { accessToken: _token } },
            );

            console.log();
            await request(app)
                .post('/api/surveys')
                .set('x-access-token', _token)
                .send({
                    question: 'Question',
                    answers: [
                        {
                            answer: 'Answer 1',
                            image: 'http://image-name.com',
                        },
                        {
                            answer: 'Answer 2',
                        },
                    ],
                })
                .expect(204);
        });
    });

    describe('GET /surveys', () => {
        test('Should return 403 on load surveys without accessToken', async () => {
            await request(app).get('/api/surveys').expect(403);
        });
    });
});
