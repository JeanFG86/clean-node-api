import { AddSurveyModel } from '../../../domain/usecases/add-survey';
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from '../../../data/protocols/db/survey/add-survey-repository';

const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [
        {
            image: 'any_image',
            answer: 'any_answer',
        },
    ],
});

describe('DbAddSurvey Usecase', () => {
    test('should call AddSurveyRepository with correct values', async () => {
        class AddSurveyRepositoryStub implements AddSurveyRepository {
            async add(surveyData: AddSurveyModel): Promise<void> {
                return new Promise(resolve => resolve());
            }
        }
        const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
        const sut = new DbAddSurvey(addSurveyRepositoryStub);
        const surveyData = makeFakeSurveyData();
        await sut.add(surveyData);
        expect(addSpy).toHaveBeenCalledWith(surveyData);
    });
});