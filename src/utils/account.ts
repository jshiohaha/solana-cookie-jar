import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';

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
