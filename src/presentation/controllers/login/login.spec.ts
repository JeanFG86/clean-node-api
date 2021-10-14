import { InvalidParamError, MissingParamError } from '../../errors';
import {
    badRequest,
    serverError,
    unauthorized,
} from '../../helpers/http-helper';
import { EmailValidator, HttpRequest, Authentication } from './login-protocols';
import { LoginController } from './login';

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

const makeAthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'));
        }
    }
    return new AuthenticationStub();
};

interface SutType {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
    authenticationStub: Authentication;
}

const makefakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password',
    },
});

const makeSut = (): SutType => {
    const emailValidatorStub = makeEmailValidator();
    const authenticationStub = makeAthentication();
    const sut = new LoginController(emailValidatorStub, authenticationStub);
    return {
        sut,
        emailValidatorStub,
        authenticationStub,
    };
};
describe('Login Controller', () => {
    test('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: 'any_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('email')),
        );
    });

    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('password')),
        );
    });

    test('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpResponse = await sut.handle(makefakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('email')),
        );
    });

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        await sut.handle(makefakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    test('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest
            .spyOn(emailValidatorStub, 'isValid')
            .mockImplementationOnce(() => {
                throw new Error();
            });
        const httpResponse = await sut.handle(makefakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        await sut.handle(makefakeRequest());
        expect(authSpy).toHaveBeenCalledWith(
            'any_email@mail.com',
            'any_password',
        );
    });

    test('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut();
        const isValidSpy = jest
            .spyOn(authenticationStub, 'auth')
            .mockReturnValueOnce(new Promise(resolve => resolve(null)));
        const httpResponse = await sut.handle(makefakeRequest());
        expect(httpResponse).toEqual(unauthorized());
    });

    test('should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut();
        const isValidSpy = jest
            .spyOn(authenticationStub, 'auth')
            .mockReturnValueOnce(
                new Promise((resolve, reject) => reject(new Error())),
            );
        const httpResponse = await sut.handle(makefakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });
});
