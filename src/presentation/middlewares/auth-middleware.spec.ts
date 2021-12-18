import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';
import { AccountModel } from '../../domain/models/account';

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
});

describe('Auth Middleware', () => {
    test('should return 403 if no x-access-token exist in headers', async () => {
        class LoadAccountByTokenStub implements LoadAccountByToken {
            async load(
                accessToken: string,
                role?: string,
            ): Promise<AccountModel> {
                return new Promise(resolve => resolve(makeFakeAccount()));
            }
        }
        const loadAccountByTokenStub = new LoadAccountByTokenStub();

        const sut = new AuthMiddleware(loadAccountByTokenStub);
        const httpresponse = await sut.handle({});
        expect(httpresponse).toEqual(forbidden(new AccessDeniedError()));
    });

    test('should call LoadAccountByToken with correct accessToken', async () => {
        class LoadAccountByTokenStub implements LoadAccountByToken {
            async load(
                accessToken: string,
                role?: string,
            ): Promise<AccountModel> {
                return new Promise(resolve => resolve(makeFakeAccount()));
            }
        }
        const loadAccountByTokenStub = new LoadAccountByTokenStub();
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
        const sut = new AuthMiddleware(loadAccountByTokenStub);
        await sut.handle({
            headers: {
                'x-access-token': 'any_token',
            },
        });
        expect(loadSpy).toHaveBeenCalledWith('any_token');
    });
});
