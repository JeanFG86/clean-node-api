import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

let surveyCollection: Collection;

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });
    afterAll(async () => {
        MongoHelper.disconnect();
    });
    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys');
        surveyCollection.deleteMany({});
    });

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository();
    };

    test('should add a survey on success', async () => {
        const sut = makeSut();
        await sut.add({
            question: 'any_question',
            answers: [
                {
                    image: 'any_image',
                    answer: 'any_answare',
                },
                {
                    answer: 'other_answare',
                },
            ],
            date: new Date(),
        });
        const survey = await surveyCollection.findOne({
            question: 'any_question',
        });
        expect(survey).toBeTruthy();
    });
});
