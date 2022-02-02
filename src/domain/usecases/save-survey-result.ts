import { SurveyResultModel } from '@/domain/models/survey-result';

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export type SaveSurveyResult = {
    add(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
};
