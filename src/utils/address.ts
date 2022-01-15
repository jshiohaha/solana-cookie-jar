import { ENV } from '@solana/spl-token-registry';

import { SOLANA_EXPLORER_ADDR, SOLSCAN_ADDR, SOLANA_BEACH_ADDR } from '../constants';
import { InvalidExplorerError } from '../errors';

enum ChainExplorers {
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
