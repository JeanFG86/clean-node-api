import { MissingParamError } from '../../errors';
import { ValidationComposite } from './validation-composite';
import { Validation } from './validations';

describe('Validation Composite', () => {
    test('Should return an error any validation fails', () => {
        class ValidationStub implements Validation {
            validate(input: any): Error {
                return new MissingParamError('field');
            }
        }
        const validationStub = new ValidationStub();
        const sut = new ValidationComposite([validationStub]);
        const error = sut.validate({ field: 'any_value' });
        expect(error).toEqual(new MissingParamError('field'));
    });
});
