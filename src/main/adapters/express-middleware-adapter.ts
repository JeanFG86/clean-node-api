import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '../../presentation/protocols';

export const adaptMiddleware = (moddleware: Middleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: HttpRequest = {
            headers: req.headers,
        };
        const httpResponse = await moddleware.handle(httpRequest);
        if (httpResponse.statusCode === 200) {
            Object.assign(req, httpResponse.body);
            next();
        } else {
            res.status(httpResponse.statusCode).json({
                error: httpResponse.body.message,
            });
        }
    };
};
