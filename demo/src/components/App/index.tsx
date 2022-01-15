import { useMemo, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ENV } from '@solana/spl-token-registry';
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletWallet,
    getSolletExtensionWallet,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import toast, { Toaster } from 'react-hot-toast';

/** @ts-ignore */
import { Wallet } from '../Wallet';

import './App.css';
require('@solana/wallet-adapter-react-ui/styles.css');

const getFormattedAddress = (addr: string, chunkSize: number = 4) => {
    const addressLength = addr.length - 1;

    const prefix = addr.substring(0, chunkSize);
    const suffix = addr.substring(addressLength - chunkSize, addressLength);

    return `${prefix}...${suffix}`;
};

const getClusterQueryString = (env: ENV) => {
    if (env === ENV.Devnet) {
        return '?cluster=devnet';
    } else if (env === ENV.Testnet) {
        return '?cluster=testnet';
    }

    return '';
};

const getTxLink = (sig: string, env: ENV) => {
    const baseAddress = 'https://solscan.io';
    const clusterQueryString = getClusterQueryString(env);
    return `${baseAddress}/tx/${sig}${clusterQueryString}`;
};

const getWalletAdapterNetwork = (env: ENV) => {
    if (ENV.Devnet === env) {
        return WalletAdapterNetwork.Devnet;
    } else if (ENV.Testnet === env) {
        return WalletAdapterNetwork.Testnet;
    }

    return WalletAdapterNetwork.Mainnet;
};

export const App = () => {
    const [network, setNetwork] = useState(ENV.MainnetBeta);
    const endpoint = useMemo(() => clusterApiUrl(getWalletAdapterNetwork(network)), [network]);

    // @solana/wallet-adapter-wallets imports all the adapters but supports tree shaking --
    // only the wallets you want to support will be compiled into your application
    const wallets = useMemo(
        () => [
            getSolflareWallet(),
            getPhantomWallet(),
            getSolletWallet(),
            getLedgerWallet(),
            getSlopeWallet(),
            getSolletExtensionWallet(),
        ],
        []
    );

    const onError = (err: Error) => toast.error(`Error: ${err.message}`);

    const onNetworkChange = (env: ENV) => setNetwork(env);

    const onSubmit = (signature: string | undefined) => {
        toast(
            (t) => (
                <span>
                    Transaction signature:{' '}
                    {signature ? (
                        <a
                            className="address--link"
                            target="_blank"
                            rel="noreferrer"
                            href={getTxLink(signature, network)}
                        >
                            {getFormattedAddress(signature)}
                        </a>
                    ) : (
                        <b>Undefined</b>
                    )}
                </span>
            ),
            {
                icon: '✅',
            }
        );
    };

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Wallet network={network} onError={onError} onSubmit={onSubmit} onNetworkChange={onNetworkChange} />
                    <div className="source--link--container">
                        Source on{' '}
                        <a target="_blank" rel="noreferrer" href="https://github.com/jshiohaha/solana-cookie-jar">
                            Github
                        </a>
                    </div>
                </WalletModalProvider>
                <Toaster position="bottom-left" reverseOrder={false} />
            </WalletProvider>
        </ConnectionProvider>
    );
};
