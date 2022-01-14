import { ENV, TokenInfo } from '@solana/spl-token-registry';
import { PublicKey, Connection } from '@solana/web3.js';

/** local helper functions & vars */
import { TokenAccount, AugmentedTokenInfo, parseTokenAccountData } from './account';
import { DEFAULT_SOL_TOKEN, TOKEN_PROGRAM_ID } from './constant';
import * as chain101Tokens from '../data/tokens/101/tokens.json';
import * as chain102Tokens from '../data/tokens/102/tokens.json';
import * as chain103Tokens from '../data/tokens/103/tokens.json';
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

export const getTokenInfo = (token: TokenAccount, env: number) => {
    const knownTokens = getKnownTokens(env);

    const tokenMint = token.data.tokenAccountInfo.mint.toString();
    const optionalTokenInfo = knownTokens[tokenMint];

    const tokenInfo = optionalTokenInfo
        ? optionalTokenInfo
        : DEFAULT_SOL_TOKEN['address'] === tokenMint
        ? DEFAULT_TOKEN_INFO
        : ({
              chainId: env,
              address: tokenMint,
              symbol: 'UNKOWN',
              name: 'Unkown Token',
              // for unknown tokens, we will use raw amount and not use a power for token decimals.
              decimals: token.data.tokenAccountInfo.tokenAmount.decimals,
              logoURI: questionMark,
          } as TokenInfo);

    return {
        tokenAccountData: token,
        tokenInfo,
    };
};

export const computeTokenAmount = (amount: number | string, token: AugmentedTokenInfo): number => {
    const numericAmount = +amount;

    if (numericAmount === 0) {
        throw new InvalidTokenAmountError('Must specify a token amount greater than zero.');
    }

    return numericAmount * Math.pow(10, token.tokenInfo.decimals);
};

export const getKnownTokens = (env: ENV) => {
    if (env === ENV.Devnet) {
        return (chain103Tokens as any).default;
    } else if (env === ENV.Testnet) {
        return (chain102Tokens as any).default;
    }

    return (chain101Tokens as any).default;
};

export const getTokensInWallet = async (pubKey: PublicKey | null, connection: Connection) => {
    if (!pubKey) {
        throw new InvalidPublicKeyError('Must provide a valid PublicKey.');
    }

    let tokenAccounts = [];
    const solTokens = await connection.getBalance(pubKey);

    if (solTokens > 0) {
        const uiAmount: string = `${(solTokens / 10 ** DEFAULT_SOL_TOKEN['decimals']).toFixed(4)}`;

        const solTokenAccount = {
            pubkey: DEFAULT_SOL_TOKEN['address'],
            data: {
                tokenAccountInfo: {
                    isNative: true,
                    mint: DEFAULT_SOL_TOKEN['address'],
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
        } as any;

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
    });

    tokenAccounts.push(...parsedtokenAccounts);

    return tokenAccounts;
};

export const isSplToken = (token: any) => {
    return token.pubkey !== DEFAULT_SOL_TOKEN['address'];
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
