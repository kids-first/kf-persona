import { Request, Response, NextFunction } from 'express';
import { GraphQLError, GraphQLFormattedError, SourceLocation } from 'graphql';

export class AccessError extends Error {
    public status = 403;
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends Error {
    public status = 404;
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class GraphQLPersonaError implements GraphQLFormattedError {
    message: string;
    locations?: readonly SourceLocation[];
    path?: readonly (string | number)[];
    extensions?: Record<string, any>;

    constructor(message: string) {
        this.message = message;
    }
}

export const formatGraphQLError: (err: GraphQLError) => GraphQLPersonaError = (err) => {
    // eslint-disable-next-line no-console
    console.log(err);

    const originalError = err.originalError; //graphql

    const showDetailsToClient = originalError instanceof AccessError;
    if (showDetailsToClient) {
        return new GraphQLPersonaError(originalError.message);
    }

    return new GraphQLPersonaError('Internal Error');
};

export const unknownEndpointHandler = (_req: Request, _res: Response): void => {
    const notFoundErr = new NotFoundError('Not Found');
    notFoundErr.status = 404;
    throw notFoundErr;
};

export const globalErrorHandler = (
    err: Error | AccessError | NotFoundError,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const status = err instanceof AccessError || err instanceof NotFoundError ? err.status : 500;
    res.status(status);
    res.send({
        message: req.app.get('env') === 'development' ? err.message : {},
    });
};

export const globalErrorLogger = (
    err: Error | AccessError | NotFoundError,
    _req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    console.error(err.stack);
    next(err);
};
