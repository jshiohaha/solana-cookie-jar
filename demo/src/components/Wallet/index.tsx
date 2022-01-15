import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ENV } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';

import { CookieJar } from 'solana-cookie-jar';
import { NetworkSelector } from '../NetworkSelector';

// could also be a const or state var... whatever you want, really!
const DESINATION_PUBLIC_KEY = new PublicKey(process.env.REACT_APP_DESTINATION_ADDRESS!);

interface WalletProps {
    network: ENV;
    onError: (err: Error) => void;
    onSubmit: (signature: string | undefined) => void;
    onNetworkChange: (env: ENV) => void;
}

export const Wallet = (props: WalletProps) => {
    const walletStore: WalletContextState = useWallet();

    return (
        <>
            <div className="wrapper">
                <div className="connection--container">
                    <NetworkSelector network={props.network} onChange={(env: ENV) => props.onNetworkChange(env)} />
                    &nbsp;&nbsp;&nbsp;
                    <div className="wallet--button--container">
                        <WalletMultiButton className="wallet-connect--base wallet-connect" />
                        &nbsp;&nbsp;&nbsp;
                        <WalletDisconnectButton
                            className={`wallet-connect--base ${
                                walletStore.publicKey ? 'wallet-connect' : 'wallet-disconnect'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <div className="card w-25 card--background">
                <div id="container">
                    <CookieJar
                        title="Send Tokens"
                        actionButtonText="Send"
                        env={props.network}
                        // @ts-ignore
                        walletContextState={walletStore}
                        destinationAddress={DESINATION_PUBLIC_KEY}
                        showDestinationAddress={true}
                        showMessageInput={true}
                        onError={props.onError}
                        onSubmit={props.onSubmit}
                    />
                </div>
            </div>
        </>
    );
};
