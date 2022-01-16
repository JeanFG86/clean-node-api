import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { Authentication } from '@/data/usecases/authentication/db-authentication-protocols';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import env from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
    const bcryptAdapter = new BcryptAdapter(12);
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const accountMongoRepository = new AccountMongoRepository();
    return new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository,
    );
};
