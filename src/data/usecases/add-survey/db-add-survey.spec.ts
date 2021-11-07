import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/add-survey';
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

const makeAddSurvayRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add(surveyData: AddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve());
        }
    }
    return new AddSurveyRepositoryStub();
};

interface SutTypes {
    sut: DbAddSurvey;
    addSurveyRepositoryStub: AddSurveyRepository;
}

const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurvayRepository();
    const sut = new DbAddSurvey(addSurveyRepositoryStub);

    return {
        addSurveyRepositoryStub,
        sut,
    };
};

describe('DbAddSurvey Usecase', () => {
    test('should call AddSurveyRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
        const surveyData = makeFakeSurveyData();
        await sut.add(surveyData);
        expect(addSpy).toHaveBeenCalledWith(surveyData);
    });
});
