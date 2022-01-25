import { MissingParamError } from '@/presentation/errors';
import {
    badRequest,
    ok,
    serverError,
    unauthorized,
} from '@/presentation/helpers/http/http-helper';
import {
    HttpRequest,
    Authentication,
    Validation,
    AuthenticationModel,
} from './login-controller-protocols';
import { LoginController } from './login-controller';

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null;
        }
    }
    return new ValidationStub();
};

const makeAthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationModel): Promise<string> {
            return new Promise(resolve => resolve('any_token'));
        }
    }
    return new AuthenticationStub();
};

type SutType = {
    sut: LoginController;
    authenticationStub: Authentication;
    validationStub: Validation;
};

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password',
    },
});

const makeSut = (): SutType => {
    const authenticationStub = makeAthentication();
    const validationStub = makeValidation();
    const sut = new LoginController(authenticationStub, validationStub);
    return {
        sut,
        authenticationStub,
        validationStub,
    };
};
describe('Login Controller', () => {
    test('should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        await sut.handle(makeFakeRequest());
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com',
            password: 'any_password',
        });
    });

    test('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise(resolve => resolve(null)),
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(unauthorized());
    });

    test('should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())),
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
    });

    test('Should call Validation with correct values', () => {
        const { sut, validationStub } = makeSut();
        const addSpy = jest.spyOn(validationStub, 'validate');
        const httpRequest = makeFakeRequest();
        sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    test('Should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('any_field')),
        );
    });
});
