import { PublicKey } from '@solana/web3.js';
import { TokenInfo, ENV } from '@solana/spl-token-registry';

/** local helper functions & vars */
import { getTokenInfo } from './token';
import { UnexpectedTokenLengthError } from '../errors';

export interface AugmentedTokenInfo {
    tokenInfo: TokenInfo;
    tokenAccountData?: TokenAccount;
}

export interface TokenAmount {
    amount: string;
    decimals: number;
    uiAmount: string;
    uiAmountString: string;
}

export interface TokenAccountInfo {
    isNative: boolean;
    mint: PublicKey;
    owner: PublicKey;
    program: string;
    space: string;
    tokenAmount: TokenAmount;
}

export interface TokenAccountData {
    tokenAccountInfo: TokenAccountInfo;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
}

export interface TokenAccount {
    pubkey: PublicKey;
    data: TokenAccountData;
}

export const parseTokenAmount = (obj: any) => {
    return {
        amount: obj['amount'],
        decimals: obj['decimals'],
        uiAmount: obj['uiAmount'],
        uiAmountString: obj['uiAmountString'],
    } as TokenAmount;
};
export const parseTokenAccountInfo = (obj: any) => {
    const parsed = obj['parsed'];
    const info = parsed['info'];

    return {
        isNative: info['isNative'],
        mint: info['mint'],
        owner: info['owner'],
        tokenAmount: parseTokenAmount(info['tokenAmount']),
        program: obj['program'],
        space: obj['space'],
    } as TokenAccountInfo;
};

export const parseTokenAccountData = (obj: any) => {
    return {
        tokenAccountInfo: parseTokenAccountInfo(obj['data']),
        executable: obj['executable'],
        lamports: obj['lamports'],
        owner: obj['owner'],
        rentEpoch: obj['rentEpoch'],
    } as TokenAccountData;
};

export const augmentTokenAccount = (token: TokenAccount, env: ENV): AugmentedTokenInfo => {
    const augmentedTokens = augmentTokenAccounts([token], env);

    if (augmentedTokens.length !== 1) {
        throw new UnexpectedTokenLengthError(`Expected 1 augmented token, found ${augmentedTokens.length}`);
    }

    return augmentedTokens[0];
};

export const augmentTokenAccounts = (tokens: TokenAccount[], env: ENV): AugmentedTokenInfo[] => {
    return tokens
        .map((token: TokenAccount) => {
            // token is an NFT
            if (token.data.tokenAccountInfo.tokenAmount.decimals === 0) {
                return null as any;
            }

            // no token amount in the account
            if (+token.data.tokenAccountInfo.tokenAmount.amount === 0) {
                return null as any;
            }

            return getTokenInfo(token, env);
        })
        .filter((token) => token); // filter out null results
};
