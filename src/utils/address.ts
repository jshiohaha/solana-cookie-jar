import { ENV } from '@solana/spl-token-registry';

import { InvalidExplorerError } from '../errors';

export enum ChainExplorers {
    SOLANA_EXPLORER = 'Solana Explorer',
    SOLSCAN = 'Solscan',
    SOLANA_BEACH = 'Solana Beach',
}

export const getFormattedAddress = (addr: string, chunkSize: number = 4) => {
    const addressLength = addr.length - 1;

    const prefix = addr.substring(0, chunkSize);
    const suffix = addr.substring(addressLength - chunkSize, addressLength);

    return `${prefix}...${suffix}`;
};

const SOLANA_EXPLORER_ADDR = 'https://explorer.solana.com';
const SOLSCAN_ADDR = 'https://solscan.io';
const SOLANA_BEACH_ADDR = 'https://solanabeach.io';

const getExplorerBase = (explorer: ChainExplorers) => {
    if (explorer === ChainExplorers.SOLANA_EXPLORER) {
        return SOLANA_EXPLORER_ADDR;
    } else if (explorer === ChainExplorers.SOLSCAN) {
        return SOLSCAN_ADDR;
    } else if (explorer === ChainExplorers.SOLANA_BEACH) {
        return SOLANA_BEACH_ADDR;
    }

    throw new InvalidExplorerError(`Address for explorer ${explorer} not found.`);
};

const getClusterQueryString = (env: ENV) => {
    if (env === ENV.Devnet) {
        return '?cluster=devnet';
    } else if (env === ENV.Testnet) {
        return '?cluster=testnet';
    }
    return '';
};

export const getAddressLink = (addr: string, env: ENV, explorer?: ChainExplorers) => {
    const baseAddress = !explorer ? SOLANA_EXPLORER_ADDR : getExplorerBase(explorer);
    const clusterQueryString = getClusterQueryString(env);
    return `${baseAddress}/address/${addr}${clusterQueryString}`;
};
