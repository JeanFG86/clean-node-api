import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './auth-middleware';

describe('Auth Middleware', () => {
    test('should return 403 if no x-access-token exist in headers', async () => {
        const sut = new AuthMiddleware();
        const httpresponse = await sut.handle({});
        expect(httpresponse).toEqual(forbidden(new AccessDeniedError()));
    });
});
