import { ENV } from '@solana/spl-token-registry';
import { Connection, clusterApiUrl } from '@solana/web3.js';

export const getClusterName = (env: ENV) => {
    if (env === ENV.Devnet) {
        return 'devnet';
    } else if (env === ENV.Testnet) {
        return 'testnet';
    }
    return 'mainnet-beta';
};

export const getEndpointForChainId = (env: ENV) => {
    return clusterApiUrl(getClusterName(env));
};

export const createNewConnection = (env: ENV) => {
    return new Connection(getEndpointForChainId(env));
};
