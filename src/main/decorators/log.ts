import { LogErrorRepository } from '../../data/protocols/db/log-error-repository';
import {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller;
    private readonly logErrorRepostitory: LogErrorRepository;
    constructor(
        controller: Controller,
        logErrorRepository: LogErrorRepository,
    ) {
        this.controller = controller;
        this.logErrorRepostitory = logErrorRepository;
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest);
        if (httpResponse.statusCode === 500) {
            await this.logErrorRepostitory.logError(httpResponse.body.stack);
        }
        return httpResponse;
    }
}
