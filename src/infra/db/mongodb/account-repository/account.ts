import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        //console.log(result);

        const account = await accountCollection.findOne(result.insertedId);

        //console.log(account.email);

        const r = {
            id: account._id,
            name: account.name,
            email: account.email,
            password: account.password,
        };
        return r;
        //console.log(r);
        //const { _id, ...accountWithoutId } = account;
        //const retorno = Object.assign({}, accountWithoutId, { id: _id });

        //console.log(retorno);
        //return new Promise(resolve => resolve(null));
        //return retorno;
    }
}
