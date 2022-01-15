import { ENV, TokenInfo } from '@solana/spl-token-registry';
import { PublicKey, Connection } from '@solana/web3.js';

/** local helper functions & vars */
import { TokenAccount, AugmentedTokenInfo, parseTokenAccountData } from './account';
import { DEFAULT_SOL_TOKEN, TOKEN_PROGRAM_ID } from './constant';
import { InvalidPublicKeyError, InvalidTokenAmountError } from '../errors';

// local asset import
import questionMark from '../assets/images/question--mark.svg';

export const DEFAULT_TOKEN_INFO = {
    chainId: ENV.MainnetBeta,
    address: DEFAULT_SOL_TOKEN['address'],
    name: DEFAULT_SOL_TOKEN['name'],
    decimals: DEFAULT_SOL_TOKEN['decimals'],
    symbol: DEFAULT_SOL_TOKEN['symbol'],
    logoURI: DEFAULT_SOL_TOKEN['logoURI'],
};

export const getUnkownTokenInfo = (token: TokenAccount, env: ENV) => {
    return {
        chainId: env,
        address: token.data.tokenAccountInfo.mint.toString(),
        symbol: 'UNKOWN',
        name: 'Unkown Token',
        // for unknown tokens, we will use raw amount and not use a power for token decimals.
        decimals: token.data.tokenAccountInfo.tokenAmount.decimals,
        logoURI: questionMark,
    } as TokenInfo;
}

export const computeTokenAmount = (amount: number | string, token: AugmentedTokenInfo): number => {
    const numericAmount = +amount;

    if (numericAmount === 0) {
        throw new InvalidTokenAmountError('Must specify a token amount greater than zero.');
    }

    return numericAmount * Math.pow(10, token.tokenInfo.decimals);
};

export const getTokensInWallet = async (pubKey: PublicKey | null, connection: Connection) => {
    if (!pubKey) {
        throw new InvalidPublicKeyError('Must provide a valid PublicKey.');
    }

    let tokenAccounts: TokenAccount[] = [];
    const solTokens = await connection.getBalance(pubKey);

    if (solTokens > 0) {
        const uiAmount: string = `${(solTokens / 10 ** DEFAULT_SOL_TOKEN['decimals']).toFixed(4)}`;

        const solTokenAccount = {
            pubkey: new PublicKey(DEFAULT_SOL_TOKEN['address']),
            data: {
                tokenAccountInfo: {
                    isNative: true,
                    mint: new PublicKey(DEFAULT_SOL_TOKEN['address']),
                    owner: pubKey,
                    program: 'spl-tokens',
                    space: '0',
                    tokenAmount: {
                        amount: `${solTokens}`,
                        decimals: DEFAULT_SOL_TOKEN['decimals'],
                        uiAmount,
                        uiAmountString: uiAmount,
                    },
                },
                executable: false,
                lamports: 0,
                owner: pubKey.toString(),
                rentEpoch: 0,
            },
        } as TokenAccount;

        tokenAccounts.push(solTokenAccount);
    }

    const account: any = await connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: TOKEN_PROGRAM_ID,
    });

    const parsedtokenAccounts = account['value'].map((obj: any) => {
        return {
            pubkey: obj['pubkey'],
            data: parseTokenAccountData(obj['account']),
        } as TokenAccount;
    }).filter((token: TokenAccount) => {
        // token is an NFT
        const isNft = token.data.tokenAccountInfo.tokenAmount.decimals === 0;
        // no token amount in the account
        const nonZeroAmount = +token.data.tokenAccountInfo.tokenAmount.amount === 0;
       
        return !isNft && !nonZeroAmount;
    });

    tokenAccounts.push(...parsedtokenAccounts);

    return tokenAccounts;
};

export const provideDefaultToken = () => {
    return {
        tokenInfo: DEFAULT_TOKEN_INFO,
    };
};

export const doesWalletHaveTokens = (token: AugmentedTokenInfo) => {
    // if not disabled by this point, check data in token accouont
    return token.tokenAccountData !== undefined && +token.tokenAccountData.data.tokenAccountInfo.tokenAmount.amount > 0;
};
