import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account';
import { AddAccount } from '../../../../data/usecases/add-account/db-add-account-protocols';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';

export const makeDbAddAccount = (): AddAccount => {
    const bcryptAdapter = new BcryptAdapter(12);
    const accountMongoRepository = new AccountMongoRepository();
    return new DbAddAccount(
        bcryptAdapter,
        accountMongoRepository,
        accountMongoRepository,
    );
};
