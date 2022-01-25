export type Authentication = {
    auth(authentication: AuthenticationModel): Promise<string>;
};

export type AuthenticationModel = {
    email: string;
    password: string;
};
