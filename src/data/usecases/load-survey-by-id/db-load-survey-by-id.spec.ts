import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/models/survey';
import MockDate from 'mockdate';
import { DbLoadSurveyById } from './db-load-survey-by-id';

const makeFakeSurvey = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer',
            },
        ],
        date: new Date(),
    };
};

type SutTypes = {
    sut: DbLoadSurveyById;
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        loadById(id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()));
        }
    }

    return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
    return {
        sut,
        loadSurveyByIdRepositoryStub,
    };
};

describe('DbLoadSurveyById', () => {
    beforeAll(() => {
        MockDate.set(new Date());
    });
    afterAll(() => {
        MockDate.reset();
    });
    test('should call LoadSurveyByIdRepository', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut();
        const loadById = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
        await sut.loadById('any_id');
        expect(loadById).toHaveBeenCalledWith('any_id');
    });

    test('should return Survey on success', async () => {
        const { sut } = makeSut();
        const surveys = await sut.loadById('any_id');
        expect(surveys).toEqual(makeFakeSurvey());
    });

    test('should throw if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut();
        jest.spyOn(
            loadSurveyByIdRepositoryStub,
            'loadById',
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())),
        );
        const promise = sut.loadById('any_id');
        await expect(promise).rejects.toThrow();
    });
});
