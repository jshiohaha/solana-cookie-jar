export class CustomBaseError extends Error {
    public error: any;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(message?: string, error?: any) {
        super(message);
        this.error = error;
    }
}

// custom application errors
export class TransactionError extends CustomBaseError {
    name = 'TransactionError';
}

export class InvalidTokenAmountError extends CustomBaseError {
    name = 'InvalidTokenAmountError';
}

export class InvalidPublicKeyError extends CustomBaseError {
    name = 'InvalidPublicKeyError';
}

export class InvalidExplorerError extends CustomBaseError {
    name = 'InvalidExplorerError';
}

export class UnexpectedTokenLengthError extends CustomBaseError {
    name = 'UnexpectedTokenLengthError';
}

export class InvalidChainIdError extends CustomBaseError {
    name = 'InvalidChainIdError';
}

export class UnableToLoadTokensError extends CustomBaseError {
    name = 'UnableToLoadTokensError';
}

export class InvalidBufferLength extends CustomBaseError {
    name = 'InvalidBufferLength';
}

export class TokenAmountTooLarge extends CustomBaseError {
    name = 'TokenAmountTooLarge';
}

export class MessageTooLarge extends CustomBaseError {
    name = 'MessageTooLarge';
}

// general token account validation errors

export class TokenInvalidMintError extends CustomBaseError {
    name = 'TokenInvalidMintError';
}

export class TokenInvalidOwnerError extends CustomBaseError {
    name = 'TokenInvalidOwnerError';
}

export class TokenOwnerOffCurveError extends CustomBaseError {
    name = 'TokenOwnerOffCurveError';
}

export class TokenAccountNotFoundError extends CustomBaseError {
    name = 'TokenAccountNotFoundError';
}

export class TokenInvalidAccountOwnerError extends CustomBaseError {
    name = 'TokenInvalidAccountOwnerError';
}

export class TokenInvalidAccountSizeError extends CustomBaseError {
    name = 'TokenInvalidAccountSizeError';
}
