import {
    ValidationComposite,
    RequiredFieldValidation,
    EmailValidation,
    CompareFieldsValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validations';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
        new CompareFieldsValidation('password', 'passwordConfirmation'),
    );
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
    return new ValidationComposite(validations);
};
