import { ENV } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';

export const ENVS = [ENV.MainnetBeta, ENV.Testnet, ENV.Devnet];

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const DEFAULT_SOL_TOKEN: TokenInfo = {
    address: 'So11111111111111111111111111111111111111112',
    chainId: 101, // doesn't matter, SOL is SOL
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    extensions: {
        coingeckoId: 'solana',
        website: 'https://solana.com/',
    },
};

export const MEMO_PROGRAM_PUBLIC_KEY = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const UTF_8 = 'utf-8';

// it looks like memo message can be arbitrarily large, but transaction sizes are limited.
// 1232 bytes at this time: https://solana.wiki/docs/solidity-guide/transactions.
// even when creating new token accounts, there should be plenty of room below tx size limit.
export const MAX_MESSAGE_LENGTH_IN_CHARS = 250;

export const MESSAGE_INPUT_DEFAULT = 'Optionally include a message in the transaction.';
