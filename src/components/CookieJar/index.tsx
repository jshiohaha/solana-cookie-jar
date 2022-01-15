import { useState, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { ENV } from '@solana/spl-token-registry';

/** local components */
import { TokenAmountInput } from '../TokenAmountInput';
import { SelectTokenDisplay } from '../SelectTokenDisplay';
import { TokenMessageInput } from '../TokenMessageInput';

/** local helper functions & vars */
import { useTransfer } from '../../hooks/useTransfer';
import { AugmentedTokenInfo } from '../../utils/account';
import { computeTokenAmount, provideDefaultToken, doesWalletHaveTokens } from '../../utils/token';
import { getFormattedAddress, getAddressLink } from '../../utils/address';
import { createNewConnection } from '../../utils/env';
import { MAX_MESSAGE_LENGTH_IN_CHARS, MESSAGE_INPUT_DEFAULT } from '../../constants';

import '../../assets/styles/common.css';
import './CookieJar.css';

export interface CookieJarProps {
    // https://github.com/solana-labs/token-list/blob/1d4da210a6cbfa1755f4154bf6249f713a5a0c7c/src/lib/tokenlist.ts#L5-L9
    env: ENV;
    // requiring the entire WalletContextState, as this obj contains some handy methods
    // for signing transactions within the browser. i could not get the wallet adapter's
    // useWallet hook to work here. instead of creating and passing down, it might
    // make more sense to create a custom connection context and use that? this
    // approach might reduce additional renders triggered from changes in WalletContextState.
    walletContextState: WalletContextState;
    showMessageInput: boolean;
    showDestinationAddress: boolean;
    destinationAddress: PublicKey;
    onError: (e: Error) => void;
    onSubmit: (txSignature: string | undefined) => void;
    title?: string;
    actionButtonText?: string;
}

// TODO: force input reset when token sent
export const CookieJar = (props: CookieJarProps) => {
    const {
        env,
        walletContextState,
        showMessageInput,
        showDestinationAddress,
        destinationAddress,
        onSubmit,
        onError,
        title,
        actionButtonText,
    } = props;

    // create connection obj here & pass down so that child components can make
    // RPC requests. similar to creating a custom context for wallet mentioned above,
    // it might make more sense to create custom, global connection context.
    const connection = useMemo(() => {
        return createNewConnection(env);
    }, [env]);
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState<string>('');
    const [token, setToken] = useState<AugmentedTokenInfo>(provideDefaultToken());
    const transferTokens = useTransfer(connection, walletContextState);

    const _onSelectToken = (token: AugmentedTokenInfo) => setToken(token);

    const _onSubmit = async () => {
        try {
            const tokenAmount = computeTokenAmount(amount, token);
            const msg = message.length > 0 ? message : undefined;

            console.log(
                `sending ${tokenAmount} to ${destinationAddress.toString()}${
                    msg ? `with message: ${msg}` : ' with no message'
                }`
            );

            const tokenMintAddress = new PublicKey(token.tokenInfo.address);
            const tx_sig = await transferTokens(tokenMintAddress, destinationAddress, tokenAmount, msg);
            onSubmit(tx_sig);

            // force reset
        } catch (e: any) {
            onError(e);
        }
    };

    const _isSubmitDisabled = () => {
        return walletContextState.publicKey === null || !doesWalletHaveTokens(token);
    };

    const _doesWalletHaveTokens = () => {
        return doesWalletHaveTokens(token);
    };

    const _onTokenAmountChange = (amt: number) => setAmount(amt);

    const _onTokenMessageChange = (msg: string) => {
        if (msg.length > 0) {
            setMessage(msg);
        }
    };

    return (
        <>
            <div className="cookie--jar--body">
                <h1 className="cookie--jar--title">{title ? title : 'Send Tokens'}</h1>
                {showDestinationAddress && (
                    <span style={{ color: '#FFF' }}>
                        to&nbsp;
                        <a
                            className="destination--address--link"
                            target="_blank"
                            rel="noreferrer"
                            href={getAddressLink(destinationAddress.toString(), env)}
                        >
                            {getFormattedAddress(destinationAddress.toString())}
                        </a>
                    </span>
                )}

                <div className="amount--token--container">
                    <div className="input--container">
                        <TokenAmountInput
                            onChange={_onTokenAmountChange}
                            toggleReset={walletContextState.connected}
                            min={0}
                            max={
                                token.tokenAccountData?.data.tokenAccountInfo.tokenAmount.uiAmount
                                    ? +token.tokenAccountData?.data.tokenAccountInfo.tokenAmount.uiAmount
                                    : undefined
                            }
                            disabled={walletContextState.publicKey === null}
                        />
                    </div>
                    <div className="token--display--container">
                        <SelectTokenDisplay
                            publicKey={walletContextState.publicKey!}
                            env={env}
                            connection={connection}
                            disabled={walletContextState.publicKey === null}
                            onError={onError}
                            onSelectToken={_onSelectToken}
                        />
                    </div>
                </div>

                {showMessageInput && (
                    <div className="token--message--container">
                        <TokenMessageInput
                            disabled={walletContextState.publicKey === null}
                            toggleReset={walletContextState.connected}
                            placeholderContent={MESSAGE_INPUT_DEFAULT}
                            maxContentChars={MAX_MESSAGE_LENGTH_IN_CHARS}
                            onChange={_onTokenMessageChange}
                        />
                    </div>
                )}

                <button
                    type="button"
                    className={`btn transfer--button ${_isSubmitDisabled() && 'input--disabled'}`}
                    onClick={_onSubmit}
                >
                    <h2>
                        {!_doesWalletHaveTokens() ? 'Wallet is empty' : actionButtonText ? actionButtonText : 'Send'}
                    </h2>
                </button>
            </div>
        </>
    );
};
