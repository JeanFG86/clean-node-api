import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'));
    },
    async compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true));
    },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
    describe('hash()', () => {
        it('should call hash with correct value', async () => {
            const sut = makeSut();
            const hashSpy = jest.spyOn(bcrypt, 'hash');
            await sut.hash('any_value');
            expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
        });

        it('should return a valid hash on hash success', async () => {
            const sut = makeSut();
            const hash = await sut.hash('any_value');
            expect(hash).toBe('hash');
        });

        it('should call compare with correct value', async () => {
            const sut = makeSut();
            const compareSpy = jest.spyOn(bcrypt, 'compare');
            await sut.compare('any_value', 'any_hash');
            expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
        });
    });

    describe('compare()', () => {
        it('should return true compare succeeds', async () => {
            const sut = makeSut();
            const hash = await sut.compare('any_value', 'any_hash');
            expect(hash).toBe(true);
        });

        it('Should return false when compare fails', async () => {
            const sut = makeSut();
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
            const isValid = await sut.compare('any_value', 'any_hash');
            expect(isValid).toBe(false);
        });
    });
});
